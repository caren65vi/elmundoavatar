import "./Quiz.css";
import React, { useState, useEffect } from "react";
import { generateAllQuestions, getQuestionCategory } from "../../quizQuestions";
import QuizCategorySelector, { quizCategories } from "./QuizCategorySelector";
import { db } from "../../Firebase/config";
import { addDoc, collection, getDocs, orderBy, query } from "firebase/firestore";
import { Sparkles, RefreshCw, Award } from "lucide-react";

export default function Quiz({ user }) {
  const [allQuestions, setAllQuestions] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [answerStatus, setAnswerStatus] = useState(null); // 'correct' or 'incorrect'
  const [answers, setAnswers] = useState({});
  const [characterScores, setCharacterScores] = useState({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [resultCharacter, setResultCharacter] = useState(null);
  const [savingResult, setSavingResult] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const loadQuestionPool = async () => {
      const localQuestions = generateAllQuestions();
      let pool = localQuestions;

      try {
        const questionsQuery = query(collection(db, "quiz_preguntas"), orderBy("sourceId", "asc"));
        const snapshot = await getDocs(questionsQuery);
        if (!snapshot.empty) {
          pool = snapshot.docs.map((questionDoc) => questionDoc.data());
        }
      } catch (error) {
        console.warn("No se pudo cargar el quiz desde Firestore; se usarán preguntas locales.", error);
      }

      setAllQuestions(pool.map((question) => ({ ...question, category: question.category || getQuestionCategory(question) })));
    };

    loadQuestionPool();
  }, []);

  const startCategoryQuiz = (category) => {
    const categoryQuestions = allQuestions.filter((question) => question.category === category);
    setSelectedCategory(category);
    setQuizQuestions([...categoryQuestions].sort(() => Math.random() - 0.5).slice(0, 15));
    setCurrentIdx(0); setScore(0); setSelectedOpt(null); setAnswerStatus(null);
    setAnswers({}); setCharacterScores({}); setQuizFinished(false); setResultCharacter(null);
  };

  const handleSelectOption = (optIdx) => {
    const currentQ = quizQuestions[currentIdx];
    if (answers[currentQ.id]) return;

    setSelectedOpt(optIdx);
    const isCorrect = optIdx === currentQ.correctIndex;
    setAnswers((prev) => ({ ...prev, [currentQ.id]: { selectedOpt: optIdx, isCorrect } }));

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setAnswerStatus("correct");
    } else {
      setAnswerStatus("incorrect");
    }

    // Accumulate character weights for personality output
    const char = currentQ.character || "iroh";
    setCharacterScores((prev) => ({
      ...prev,
      [char]: (prev[char] || 0) + (isCorrect ? 3 : 1)
    }));

  };

  const goToQuestion = (nextIndex) => {
    const savedAnswer = answers[quizQuestions[nextIndex].id];
    setCurrentIdx(nextIndex);
    setSelectedOpt(savedAnswer?.selectedOpt ?? null);
    setAnswerStatus(savedAnswer ? (savedAnswer.isCorrect ? "correct" : "incorrect") : null);
  };

  const handlePreviousQuestion = () => {
    if (currentIdx > 0) goToQuestion(currentIdx - 1);
  };

  const handleNextQuestion = () => {
    if (currentIdx < quizQuestions.length - 1) {
      goToQuestion(currentIdx + 1);
    } else {
      calculateCharacterResult();
    }
  };

  const handleSkipQuestion = () => {
    if (currentIdx < quizQuestions.length - 1) goToQuestion(currentIdx + 1);
    else calculateCharacterResult();
  };

  const calculateCharacterResult = async () => {
    // Find character with highest accumulated score
    let bestChar = "iroh";
    let maxVal = -1;

    Object.entries(characterScores).forEach(([char, val]) => {
      if (val > maxVal) {
        maxVal = val;
        bestChar = char;
      }
    });

    const characterProfiles = {
      aang: { name: "Avatar Aang 💨", desc: "Eres alegre, pacífica, libre y optimista. Te encanta divertirte y valoras la amistad por encima de todo.", quote: "La amistad trasciende el tiempo y el espacio." },
      katara: { name: "Katara 🌊", desc: "Eres compasiva, protectora, valiente y maternal. Tienes un gran sentido de la justicia y de la lealtad.", quote: "Nunca me daré por vencida con las personas que amo." },
      toph: { name: "Toph Beifong 🌱", desc: "Eres independiente, fuerte, directa y rebelde. No te importan las apariencias y sabes sostenerte firme como la roca.", quote: "Soy la mejor maestra tierra del mundo, ¡y que no se les olvide!" },
      zuko: { name: "Zuko 🔥", desc: "Eres determinada, apasionada y buscas siempre superarte. Aprendes de tus errores y tienes un gran sentido del honor.", quote: "Debo restaurar mi propio honor." },
      sokka: { name: "Sokka 🪃", desc: "Eres ingeniosa, divertida, escéptica y estratégica. Conviertes la tensión en risas y siempre tienes un plan bajo la manga.", quote: "¡Bumerán, regresaste!" },
      iroh: { name: "Tío Iroh 🍵", desc: "Eres sabia, paciente, bondadosa y amante de la paz y de los placeres sencillos (¡como un buen té de jazmín!).", quote: "Es importante tomar té con extraños y descubrir de dónde vienen." },
      suki: { name: "Suki 🌱", desc: "Eres ágil, protectora, segura de ti misma y una excelente aliada. Lideras con el ejemplo y tienes un gran estilo.", quote: "Soy una guerrera, pero también una chica." },
      ty_lee: { name: "Ty Lee 🌸", desc: "Eres flexible, llena de energía, carismática y siempre buscas destacar positivamente. Bloqueas las malas vibras con una sonrisa.", quote: "¡La energía fluye donde va la atención!" }
    };

    const finalProfile = characterProfiles[bestChar] || characterProfiles["iroh"];
    setResultCharacter(finalProfile);
    setQuizFinished(true);

    // Save result to Firestore
    setSavingResult(true);
    try {
      await addDoc(collection(db, "quiz_resultados"), {
        userEmail: user.correo,
        userName: user.apodo,
        score: score,
        totalQuestions: quizQuestions.length,
        category: selectedCategory,
        characterObtained: finalProfile.name,
        timestamp: new Date().toISOString()
      });
    } catch (e) {
      console.error("Error saving quiz result: ", e);
    } finally {
      setSavingResult(false);
    }
  };

  const restartQuiz = () => {
    const shuffled = allQuestions.filter((question) => question.category === selectedCategory).sort(() => Math.random() - 0.5);
    setQuizQuestions(shuffled.slice(0, 15));
    setCurrentIdx(0);
    setScore(0);
    setSelectedOpt(null);
    setAnswerStatus(null);
    setAnswers({});
    setCharacterScores({});
    setQuizFinished(false);
    setResultCharacter(null);
  };

  if (allQuestions.length === 0) {
    return <div style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>Cargando Quiz de Sabiduría...</div>;
  }

  if (!selectedCategory) {
    return <QuizCategorySelector questions={allQuestions} onStart={startCategoryQuiz} />;
  }

  const currentQuestion = quizQuestions[currentIdx];
  const categoryTitle = quizCategories.find((category) => category.id === selectedCategory)?.title;

  return (
    <div className="quiz-wrapper">
      <div className="quiz-header">
        <h1 className="quiz-title">
          {categoryTitle}
        </h1>
        <p className="quiz-subtitle">
          Pregunta {currentIdx + 1} de {quizQuestions.length} — Responde y descubre qué personaje eres.
        </p>
      </div>

      {!quizFinished ? (
        <div className={`quiz-card quiz-card--${currentQuestion.nation}`}>
          {/* Progress bar */}
          <div className="quiz-progress-track">
            <div
              className={`quiz-progress-bar quiz-progress-bar--${currentQuestion.nation} quiz-progress-bar--step-${currentIdx + 1}`}
            />
          </div>

          <h2 className="quiz-question">
            {currentQuestion.question}
          </h2>

          <div className="quiz-options">
            {currentQuestion.options.map((opt, idx) => {
              let btnClass = "";
              if (selectedOpt !== null) {
                if (idx === currentQuestion.correctIndex) {
                  btnClass = "correct";
                } else if (idx === selectedOpt) {
                  btnClass = "incorrect";
                }
              }

              return (
                <button
                  key={idx}
                  className={`quiz-option ${btnClass}`}
                  onClick={() => handleSelectOption(idx)}
                  disabled={selectedOpt !== null}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {selectedOpt !== null && (
            <div
              role="status"
              className={`quiz-feedback quiz-feedback--${answerStatus}`}
            >
              <strong className="quiz-feedback__title">
                {answerStatus === "correct" ? "¡Correcto!" : `La respuesta correcta era: ${currentQuestion.options[currentQuestion.correctIndex]}.`}
              </strong>
              {currentQuestion.feedback}
            </div>
          )}

          <div className="quiz-navigation" aria-label="Navegación del quiz">
            <button
              type="button"
              className="quiz-nav-button quiz-nav-button--previous"
              onClick={handlePreviousQuestion}
              disabled={currentIdx === 0}
            >
              ← Anterior
            </button>
            <button
              type="button"
              className="quiz-nav-button quiz-nav-button--skip"
              onClick={handleSkipQuestion}
            >
              Omitir
            </button>
            <button
              type="button"
              className="quiz-nav-button quiz-nav-button--next"
              onClick={handleNextQuestion}
            >
              {currentIdx === quizQuestions.length - 1 ? "Ver resultado" : "Siguiente →"}
            </button>
          </div>
        </div>
      ) : (
        // Results Card
        <div className="quiz-results">
          <div className="quiz-results__trophy">
            🏆
          </div>

          <h2 className="quiz-results__title">
            ¡Quiz Completado!
          </h2>
          <p className="quiz-results__score">
            Puntuación: {score} / {quizQuestions.length} respuestas correctas
          </p>

          <div className="quiz-character-result">
            <div className="quiz-character-result__label">
              Eres compatible con
            </div>
            <h3 className="quiz-character-result__name">
              {resultCharacter?.name}
            </h3>
            <p className="quiz-character-result__description">
              {resultCharacter?.desc}
            </p>
            <div className="quiz-character-result__quote">
              "{resultCharacter?.quote}"
            </div>
          </div>

          <button
            onClick={restartQuiz}
            className="pergamino-btn quiz-restart"
          >
            <RefreshCw size={16} />
            <span>Jugar de Nuevo</span>
          </button>
          <button type="button" className="quiz-back-to-categories" onClick={() => setSelectedCategory(null)}>
            Elegir otra categoría
          </button>
        </div>
      )}
    </div>
  );
}
