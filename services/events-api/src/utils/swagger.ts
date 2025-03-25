import fs from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";

export async function loadSwaggerDocument() {
  try {
    const swaggerPath = path.resolve(__dirname, "../swagger.yaml");
    const yamlContent = await fs.readFile(swaggerPath, "utf8");
    return parse(yamlContent);
  } catch (error) {
    console.error("Error loading Swagger document:", error);
    throw error;
  }
}
import fs from "fs/promises";
import path from "path";
import { parse } from "yaml";

export async function loadSwaggerDocument() {
  try {
    const swaggerPath = path.resolve(__dirname, "../swagger.yaml");
    const yamlContent = await fs.readFile(swaggerPath, "utf8");
    return parse(yamlContent);
  } catch (error) {
    console.error("Error loading Swagger document:", error);
    throw error;
  }
}
