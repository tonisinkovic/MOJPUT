const fs = require("fs");
const path = require("path");

const days = [];
for (let d = 5; d <= 24; d++) {
  const dayKey = `2026-12-${String(d).padStart(2, "0")}`;
  const dayNumber = d - 4;
  const questions = [];
  for (let q = 1; q <= 10; q++) {
    const qIdx = (d - 1) * 10 + q;
    const correctIdx = qIdx % 4;
    const correctId = String.fromCharCode(97 + correctIdx);
    questions.push({
      index: q - 1,
      text: `Dan ${dayNumber}, pitanje ${q}: Testno pitanje za advent kviz (q${qIdx})`,
      options: [
        { id: "a", text: `Opcija A za q${qIdx}${correctId === "a" ? " (tocno)" : ""}` },
        { id: "b", text: `Opcija B za q${qIdx}${correctId === "b" ? " (tocno)" : ""}` },
        { id: "c", text: `Opcija C za q${qIdx}${correctId === "c" ? " (tocno)" : ""}` },
        { id: "d", text: `Opcija D za q${qIdx}${correctId === "d" ? " (tocno)" : ""}` },
      ],
      correctAnswer: correctId,
      explanation: `Objasnjenje za pitanje ${qIdx} na dan ${d}.`,
    });
  }
  days.push({
    dayKey,
    dayNumber,
    questions,
  });
}

const output = { days };
const outPath = path.join(__dirname, "..", "src", "data", "advent-league", "advent-days.json");
fs.writeFileSync(outPath, JSON.stringify(output, null, 2), "utf8");
console.log(`Generated ${days.length} days with ${days[0].questions.length} questions each = ${days.length * 10} total.`);