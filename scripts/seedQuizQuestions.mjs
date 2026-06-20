import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { initializeApp } from "firebase/app";
import { getFirestore, writeBatch, doc, serverTimestamp } from "firebase/firestore";
import { generateAllQuestions } from "../src/quizQuestions.js";

function readEnvFile(path) {
  return Object.fromEntries(
    readFileSync(path, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const separator = line.indexOf("=");
        const key = line.slice(0, separator).trim();
        const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "");
        return [key, value];
      })
  );
}

const env = readEnvFile(resolve(".env"));
const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID
});

const db = getFirestore(app);
const batch = writeBatch(db);
const questions = generateAllQuestions();

questions.forEach(({ id, ...question }) => {
  batch.set(doc(db, "quiz_preguntas", `aang_${String(id).padStart(3, "0")}`), {
    ...question,
    sourceId: id,
    series: "La leyenda de Aang",
    updatedAt: serverTimestamp()
  });
});

await batch.commit();
console.log(`${questions.length} preguntas cargadas en la colección quiz_preguntas.`);
