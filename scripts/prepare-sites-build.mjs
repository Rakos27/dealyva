import { copyFile, mkdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const source = resolve(".openai/hosting.json");
const destination = resolve("dist/.openai/hosting.json");

await mkdir(dirname(destination), { recursive: true });
await copyFile(source, destination);
await rm(resolve("dist/server/.dev.vars"), { force: true });
