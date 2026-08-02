import { Injectable, UnauthorizedException } from "@nestjs/common";
import { createHmac, randomBytes } from "crypto";

export type JwtPayload = {
  sub: string;
  email: string;
  companyId?: string | null;
  role: string;
  sessionId: string;
  type: "access" | "refresh";
};

type EncodedPayload = JwtPayload & {
  iat: number;
  exp: number;
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

@Injectable()
export class JwtService {
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
      exp: now + expiresInSeconds,
    };
    const unsignedToken = `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(encodedPayload))}`;
    const signature = createHmac("sha256", this.secret).update(unsignedToken).digest();

    return `${unsignedToken}.${base64Url(signature)}`;
  }

  verify(token: string, expectedType: "access" | "refresh") {
    const parts = token.split(".");

    if (parts.length !== 3) {
      throw new UnauthorizedException("Token invalide");
    }

    const [header, payload, signature] = parts;
    const expectedSignature = base64Url(createHmac("sha256", this.secret).update(`${header}.${payload}`).digest());

    if (signature !== expectedSignature) {
      throw new UnauthorizedException("Token invalide");
    }

    const decoded = JSON.parse(Buffer.from(payload.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8")) as EncodedPayload;

    if (decoded.exp < Math.floor(Date.now() / 1000)) {
      throw new UnauthorizedException("Token expire");
    }

    if (decoded.type !== expectedType) {
      throw new UnauthorizedException("Type de token invalide");
    }

    return decoded;
  }

  createAccessToken(payload: Omit<JwtPayload, "type">) {
    return this.sign({ ...payload, type: "access" }, parseDuration(process.env.JWT_ACCESS_EXPIRES_IN, 15 * 60));
  }

  createRefreshToken(payload: Omit<JwtPayload, "type">) {
    return this.sign({ ...payload, type: "refresh" }, parseDuration(process.env.JWT_REFRESH_EXPIRES_IN, 7 * 24 * 60 * 60));
  }

  createOpaqueRefreshToken() {
    return randomBytes(48).toString("base64url");
  }

  getRefreshTokenLifetimeMs() {
    return parseDuration(process.env.JWT_REFRESH_EXPIRES_IN, 7 * 24 * 60 * 60) * 1000;
  }
}
