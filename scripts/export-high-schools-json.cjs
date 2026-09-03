// Generate simplified JSON from highSchools.ts for backend use
const fs = require("fs");
const path = require("path");

// Read the TypeScript file
const tsPath = path.join(__dirname, "..", "src", "data", "highSchools.ts");
const jsonOutPath = path.join(__dirname, "..", "high_schools_data.json");

const content = fs.readFileSync(tsPath, "utf-8");

// Extract the array from "export const highSchools: HighSchool[] = [...]"
const match = content.match(/export const highSchools: HighSchool\[\] = (\[[\s\S]*?\n\]);/);

if (!match) {
  console.error("[export-high-schools-json] Ne mogu pronaći highSchools array u highSchools.ts");
  process.exit(1);
}

const jsonString = match[1];
const schools = JSON.parse(jsonString);

fs.writeFileSync(jsonOutPath, JSON.stringify(schools, null, 2), "utf-8");
console.log(`[export-high-schools-json] Izvezeno ${schools.length} škola u ${jsonOutPath}`);
