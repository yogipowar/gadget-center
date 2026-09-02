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

const dynamicParamFiles = [
  "src/app/(storefront)/product/[slug]/page.tsx",
  "src/app/(storefront)/products/[category]/page.tsx",
];

for (const relative of dynamicParamFiles) {
  const target = path.join(root, relative);
  if (!fs.existsSync(target)) {
    continue;
  }
  const source = fs.readFileSync(target, "utf8");
  fs.writeFileSync(
    target,
    source.replace("export const dynamicParams = true;", "export const dynamicParams = false;"),
  );
}
