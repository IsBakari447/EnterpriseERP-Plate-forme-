import { Injectable, UnauthorizedException } from "@nestjs/common";
import { createHmac, randomBytes, timingSafeEqual } from "crypto";

export type JwtPayload = {
  sub: string;
  email: string;
  companyId?: string | null;
  role: string;
  sessionId: string;
  type: "access" | "refresh";
  jti?: string;
};

type EncodedPayload = JwtPayload & {
  iat: number;
  nbf: number;
  exp: number;
  iss: string;
  aud: string;
};

type JwtHeader = {
  alg: string;
  typ: string;
};

function base64Url(input: Buffer | string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function parseDuration(value: string | undefined, fallbackSeconds: number) {
  if (!value) return fallbackSeconds;
  const match = value.match(/^(\d+)([smhd])?$/i);
  if (!match) return fallbackSeconds;

  const amount = Number(match[1]);
  const unit = (match[2] ?? "s").toLowerCase();
  const multiplier = unit === "m" ? 60 : unit === "h" ? 3600 : unit === "d" ? 86400 : 1;
  return amount * multiplier;
}

function decodeJson<T>(value: string) {
  try {
    return JSON.parse(Buffer.from(value.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8")) as T;
  } catch {
    throw new UnauthorizedException("Invalid token.");
  }
}

function secureEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

@Injectable()
export class JwtService {
  private readonly issuer = process.env.JWT_ISSUER ?? "enterpriseerp-cloud-api";
  private readonly audience = process.env.JWT_AUDIENCE ?? "enterpriseerp-cloud";

  private get secret() {
    const secret = process.env.JWT_SECRET ?? process.env.JWT_ACCESS_SECRET ?? process.env.Jwt__Key;

    if (!secret) {
      if (process.env.NODE_ENV === "production") {
        throw new Error("JWT_SECRET is required in production.");
      }

      return "enterpriseerp-dev-secret-change-me";
    }

    return secret;
  }

  sign(payload: JwtPayload, expiresInSeconds: number) {
    const header = { alg: "HS256", typ: "JWT" };
    const now = Math.floor(Date.now() / 1000);
    const encodedPayload: EncodedPayload = {
      ...payload,
      iat: now,
      nbf: now,
      exp: now + expiresInSeconds,
      iss: this.issuer,
      aud: this.audience,
    };
    const unsignedToken = `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(encodedPayload))}`;
    const signature = createHmac("sha256", this.secret).update(unsignedToken).digest();

    return `${unsignedToken}.${base64Url(signature)}`;
  }

  verify(token: string, expectedType: "access" | "refresh") {
    const parts = token.split(".");

    if (parts.length !== 3) {
      throw new UnauthorizedException("Invalid token.");
    }

    const [header, payload, signature] = parts;
    const decodedHeader = decodeJson<JwtHeader>(header);

    if (decodedHeader.alg !== "HS256" || decodedHeader.typ !== "JWT") {
      throw new UnauthorizedException("Invalid token.");
    }

    const expectedSignature = base64Url(createHmac("sha256", this.secret).update(`${header}.${payload}`).digest());

    if (!secureEqual(signature, expectedSignature)) {
      throw new UnauthorizedException("Invalid token.");
    }

    const decoded = decodeJson<EncodedPayload>(payload);
    const now = Math.floor(Date.now() / 1000);

    if (decoded.iss !== this.issuer || decoded.aud !== this.audience) {
      throw new UnauthorizedException("Invalid token.");
    }

    if (decoded.nbf > now) {
      throw new UnauthorizedException("Token not active.");
    }

    if (decoded.exp < now) {
      throw new UnauthorizedException("Token expired.");
    }

    if (decoded.type !== expectedType) {
      throw new UnauthorizedException("Invalid token type.");
    }

    return decoded;
  }

  createAccessToken(payload: Omit<JwtPayload, "type">) {
    return this.sign({ ...payload, type: "access" }, parseDuration(process.env.JWT_ACCESS_EXPIRES_IN, 15 * 60));
  }

  createRefreshToken(payload: Omit<JwtPayload, "type">) {
    return this.sign(
      {
        ...payload,
        type: "refresh",
        jti: randomBytes(16).toString("base64url"),
      },
      parseDuration(process.env.JWT_REFRESH_EXPIRES_IN, 7 * 24 * 60 * 60)
    );
  }

  createOpaqueRefreshToken() {
    return randomBytes(48).toString("base64url");
  }

  getRefreshTokenLifetimeMs() {
    return parseDuration(process.env.JWT_REFRESH_EXPIRES_IN, 7 * 24 * 60 * 60) * 1000;
  }
}
