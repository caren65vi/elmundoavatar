import { Compass, Crown, Flame, MapPin, PawPrint, Shield, Sparkles, Swords, Waves } from "lucide-react";

export const quizCategories = [
  ["aang", "Aang", "El Avatar, Appa y los Nómadas Aire.", Sparkles, "aire"],
  ["katara", "Katara y la Tribu Agua", "Maestría agua, familia y legado.", Waves, "agua"],
  ["sokka", "Sokka y sus aventuras", "Ingenio, espada y búmeran.", Compass, "agua"],
  ["zuko", "Zuko y la Nación del Fuego", "Honor, exilio y redención.", Flame, "fuego"],
  ["toph", "Toph y el Reino Tierra", "La Melón, metal control y vibraciones.", Swords, "tierra"],
  ["espiritus", "Avatares y mundo espiritual", "Roku, Kyoshi, Koh y el Estado Avatar.", Sparkles, "aire"],
  ["lugares", "Lugares y naciones", "Ba Sing Se, templos y grandes viajes.", MapPin, "tierra"],
  ["villanos", "Villanos y antagonistas", "Azula, Ozai, Dai Li y sus aliados.", Shield, "fuego"],
  ["objetos", "Animales y objetos", "Criaturas, reliquias y elementos especiales.", PawPrint, "aire"],
  ["trama", "Trama y momentos finales", "El cometa, el eclipse y la batalla final.", Crown, "fuego"]
].map(([id, title, description, icon, tone]) => ({ id, title, description, icon, tone }));

export default function QuizCategorySelector({ questions, onStart }) {
  return <section className="quiz-category-selector" aria-label="Categorías del quiz">
    <div className="quiz-header"><h1 className="quiz-title">Quiz de Avatar</h1><p className="quiz-subtitle">Elige una categoría para comenzar su reto.</p></div>
    <div className="quiz-category-grid">{quizCategories.map(({ id, title, description, icon: Icon, tone }) => {
      const count = questions.filter((question) => question.category === id).length;
      return <button key={id} type="button" className={`quiz-category-card quiz-category-card--${tone}`} onClick={() => onStart(id)} disabled={!count}>
        <Icon size={28} aria-hidden="true" /><span className="quiz-category-card__title">{title}</span><span className="quiz-category-card__description">{description}</span><span className="quiz-category-card__count">{count ? `${count} preguntas` : "Próximamente"}</span>
      </button>;
    })}</div>
  </section>;
}
