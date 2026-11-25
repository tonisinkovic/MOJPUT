"use strict";

function pdfEscape(value) {
  return String(value || "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function buildResultsPdf(lines) {
  const safe = (Array.isArray(lines) ? lines : []).map((line) => pdfEscape(line).slice(0, 110));
  const linesPerPage = 46;
  const pages = [];
  for (let i = 0; i < Math.max(safe.length, 1); i += linesPerPage) {
    pages.push(safe.slice(i, i + linesPerPage));
  }

  const objects = [];
  const pageIds = [];
  objects.push("<< /Type /Catalog /Pages 2 0 R >>");
  const fontId = 3;
  objects.push("");
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  pages.forEach((pageLines, pageIndex) => {
    const contentId = 4 + pageIndex * 2;
    const pageId = contentId + 1;
    pageIds.push(pageId);
    const commands = ["BT", "/F1 10 Tf", "40 800 Td", "14 TL"];
    pageLines.forEach((line, idx) => {
      if (idx === 0) commands.push(`(${line}) Tj`);
      else commands.push(`T* (${line}) Tj`);
    });
    commands.push("ET");
    const stream = commands.join("\n");
    objects[contentId - 1] = `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`;
    objects[pageId - 1] = `<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 ${fontId} 0 R >> >> /MediaBox [0 0 595 842] /Contents ${contentId} 0 R >>`;
  });

  objects[1] = `<< /Type /Pages /Count ${pageIds.length} /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] >>`;

  let body = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((obj, index) => {
    offsets.push(Buffer.byteLength(body));
    body += `${index + 1} 0 obj\n${obj}\nendobj\n`;
  });
  const xref = Buffer.byteLength(body);
  body += `xref\n0 ${objects.length + 1}\n`;
  body += "0000000000 65535 f \n";
  for (let i = 1; i < offsets.length; i++) {
    body += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  body += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(body, "latin1");
}

function resultsToLines(report) {
  const lines = ["MojPut — Adventska liga, rezultati", ""];
  for (const day of report.days || []) {
    lines.push(
      `${day.dayKey}  ${day.username}  ${day.totalScore} bodova  ${day.questionsCorrect}/10  ${day.completed ? "zavrseno" : "u tijeku"}`,
    );
  }
  lines.push("", "Odgovori");
  for (const answer of report.answers || []) {
    lines.push(
      `${answer.dayKey} P${answer.questionIndex + 1} ${answer.username}: ${answer.selectedAnswer || "-"} | ${answer.score} b | ${answer.correct ? "tocno" : "netocno"}`,
    );
  }
  if ((report.days || []).length === 0) lines.push("Nema spremljenih rezultata.");
  return lines;
}

module.exports = { buildResultsPdf, resultsToLines };
