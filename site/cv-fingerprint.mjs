import { createHash } from "node:crypto";
import { profile, copy, publications, skills } from "./content.mjs";
export function cvFingerprint() {
  return createHash("sha256").update(JSON.stringify({ profile, copy, publications, skills })).digest("hex");
}
