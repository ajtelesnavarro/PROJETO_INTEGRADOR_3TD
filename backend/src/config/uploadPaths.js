import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const backendDir = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

export const UPLOADS_DIR = resolve(backendDir, "uploads");
export const PROFILE_UPLOADS_DIR = resolve(UPLOADS_DIR, "perfis");
