import { Injectable } from "@nestjs/common";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

@Injectable()
export class PasswordService {
  hash(password: string) {
    const salt = randomBytes(16).toString("base64url");
    const derivedKey = scryptSync(password, salt, 64).toString("base64url");

    return `scrypt:${salt}:${derivedKey}`;
  }

  verify(password: string, storedHash: string | null | undefined) {
    if (!storedHash) return false;
    const [algorithm, salt, hash] = storedHash.split(":");

    if (algorithm !== "scrypt" || !salt || !hash) {
      return false;
    }

    const derivedKey = scryptSync(password, salt, 64);
    const storedKey = Buffer.from(hash, "base64url");

    if (derivedKey.length !== storedKey.length) {
      return false;
    }

    return timingSafeEqual(derivedKey, storedKey);
  }
}
