import fs from "node:fs/promises";
import { parse } from "yaml";
import path from "path";

export async function loadSwaggerDocument() {
  try {
    // Use path.resolve to get the absolute path to the swagger.yaml file
    const swaggerPath = path.resolve(__dirname, "../swagger.yaml");
    const yamlContent = await fs.readFile(swaggerPath, "utf8");
    return parse(yamlContent);
  } catch (error) {
    console.error("Error loading Swagger document:", error);
    throw error;
  }
}
