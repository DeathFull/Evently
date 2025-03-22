import fs from "node:fs/promises";
import { parse } from "yaml";

export async function loadSwaggerDocument() {
  try {
    const yamlContent = await fs.readFile("../swagger.yaml", "utf8");
    return parse(yamlContent);
  } catch (error) {
    console.error("Error loading Swagger document:", error);
    throw error;
  }
}
