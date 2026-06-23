import { execFileSync } from "node:child_process";
import { generateAllQuestions } from "../src/quizQuestions.js";

const projectId = "proyecto-2026-28676";
const accessToken = process.env.ACCESS_TOKEN || execFileSync("gcloud", ["auth", "print-access-token"], { encoding: "utf8" }).trim();
const toValue = (value) => {
  if (Array.isArray(value)) return { arrayValue: { values: value.map(toValue) } };
  if (typeof value === "number") return { integerValue: String(value) };
  if (typeof value === "boolean") return { booleanValue: value };
  if (value === null) return { nullValue: null };
  return { stringValue: String(value) };
};

const questions = generateAllQuestions();
const writes = questions.map(({ id, ...question }) => ({
  update: {
    name: `projects/${projectId}/databases/(default)/documents/quiz_preguntas/aang_${String(id).padStart(3, "0")}`,
    fields: Object.fromEntries(Object.entries({ ...question, sourceId: id, series: "La leyenda de Aang" }).map(([key, value]) => [key, toValue(value)]))
  }
}));

const response = await fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:commit`, {
  method: "POST",
  headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
  body: JSON.stringify({ writes })
});

if (!response.ok) throw new Error(`Firestore respondió ${response.status}: ${await response.text()}`);
console.log(`✓ ${questions.length} preguntas categorizadas se publicaron en Firestore.`);
