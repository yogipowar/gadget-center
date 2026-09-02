import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const removals = ["src/proxy.ts", "src/app/api"];

for (const relative of removals) {
  const target = path.join(root, relative);
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
  }
}
