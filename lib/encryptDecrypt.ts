import crypto from "crypto";

const ENCRYPTION_KEY = process.env.REDIS_ENCRYPTION_KEY; // 32-byte secret key
const ALGORITHM = "aes-256-cbc";

// Ensure the key is exactly 32 bytes for AES-256
function getKey(): Buffer {
  if (!ENCRYPTION_KEY) {
    throw new Error("REDIS_ENCRYPTION_KEY environment variable is required");
  }
  // Create a 32-byte key from the environment variable
  return crypto.createHash("sha256").update(ENCRYPTION_KEY).digest();
}

// Encrypt password for Redis storage
export function encryptPassword(password: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(16); // Generate random IV
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let encrypted = cipher.update(password, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

// Decrypt password for Firebase
export function decryptPassword(encryptedPassword: string): string {
  const key = getKey();
  const [ivHex, encrypted] = encryptedPassword.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
