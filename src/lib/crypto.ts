import crypto from "node:crypto";

// encrypt and decrypt the  feedbin password
const ALGORITHM = "aes-256-gcm";

const encryptionKey = process.env.ENCRYPTION_KEY;

if (!encryptionKey) {
  throw new Error("ENCRYPTION_KEY environment variable is required");
}

const key = Buffer.from(encryptionKey, "hex");

if (key.length !== 32) {
  throw new Error("ENCRYPTION_KEY must be a 32-byte hex string");
}

export function encryptPassword(plaintext: string): string {
  // Generate a fresh IV for every encryption.
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  // Store: IV + Auth Tag + Ciphertext
  return Buffer.concat([iv, authTag, encrypted]).toString("base64");
}

export function decryptPassword(payload: string): string {
  const buffer = Buffer.from(payload, "base64");

  const iv = buffer.subarray(0, 12);
  const authTag = buffer.subarray(12, 28);
  const encrypted = buffer.subarray(28);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
