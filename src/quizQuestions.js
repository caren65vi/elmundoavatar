import { bookWaterEpisodes, bookEarthEpisodes, bookFireEpisodes } from "./episodesData.js";

// A comprehensive list of hand-crafted trivia questions about Avatar: The Last Airbender.
// We also include a generator function to dynamically expand this list to 200+ questions
// to ensure the user gets a massive variety of questions without bloat in the codebase.

export const baseQuestions = [
  {
    id: 1,
    question: "¿Quién es conocido como el 'Dragón del Oeste'?",
    options: ["Zuko", "Ozai", "Iroh", "Jeong Jeong"],
    correctIndex: 2,
    nation: "fuego",
    character: "iroh"
  },
  {
    id: 2,
    question: "¿De qué tribu es originaria Katara?",
    options: ["Tribu Agua del Norte", "Tribu Agua del Sur", "Tribu Agua del Pantano", "Tribu Agua Oriental"],
    correctIndex: 1,
    nation: "agua",
    character: "katara"
  },
  {
    id: 3,
    question: "¿Cómo se llama el reino que gobierna el Rey Bumi?",
    options: ["Ba Sing Se", "Omashu", "Zaofu", "Gaoling"],
    correctIndex: 1,
    nation: "tierra",
    character: "toph"
  },
  {
    id: 4,
    question: "¿Qué animal es Momo?",
    options: ["Un lémur volador", "Un hurón de fuego", "Un oso-pato", "Un lémur de orejas caídas"],
    correctIndex: 0,
    nation: "aire",
    character: "aang"
  },
  {
    id: 5,
    question: "¿Quién inventó la técnica del Metal Control?",
    options: ["Bumi", "Aang", "Toph Beifong", "Roku"],
    correctIndex: 2,
    nation: "tierra",
    character: "toph"
  },
  {
    id: 6,
    question: "¿Cómo se llama la hermana de Zuko?",
    options: ["Mai", "Ty Lee", "Ursa", "Azula"],
    correctIndex: 3,
    nation: "fuego",
    character: "azula"
  },
  {
    id: 7,
    question: "¿Cuál es el arma favorita y más icónica de Sokka?",
    options: ["Una lanza", "Un bumerán", "Una cerbatana", "Un arco y flecha"],
    correctIndex: 1,
    nation: "agua",
    character: "sokka"
  },
  {
    id: 8,
    question: "¿Quién fue el Avatar antes de Aang?",
    options: ["Kyoshi", "Kuruk", "Roku", "Wan"],
    correctIndex: 2,
    nation: "fuego",
    character: "zuko"
  },
  {
    id: 9,
    question: "¿Cuál de los siguientes templos del aire era exclusivo para hombres?",
    options: ["Templo del Aire del Norte", "Templo del Aire del Sur", "Templo del Aire del Este", "Templo del Aire del Oeste"],
    correctIndex: 1,
    nation: "aire",
    character: "aang"
  },
  {
    id: 10,
    question: "¿Quién enseñó a Zuko a redirigir los relámpagos?",
    options: ["El tío Iroh", "El señor del fuego Ozai", "Azula", "Jeong Jeong"],
    correctIndex: 0,
    nation: "fuego",
    character: "iroh"
  },
  {
    id: 11,
    question: "¿Cuál es el apodo que Toph le pone a Aang?",
    options: ["Pies Ligeros", "Chico Aire", "Calvito", "Pies de Viento"],
    correctIndex: 0,
    nation: "tierra",
    character: "toph"
  },
  {
    id: 12,
    question: "¿Cómo se llama la princesa que se convirtió en el Espíritu de la Luna?",
    options: ["Yue", "Mai", "Azula", "Suki"],
    correctIndex: 0,
    nation: "agua",
    character: "katara"
  },
  {
    id: 13,
    question: "¿De qué metal está hecha la espada especial de Sokka?",
    options: ["Platino", "Meteorito", "Hierro de la Nación del Fuego", "Bronce antiguo"],
    correctIndex: 1,
    nation: "agua",
    character: "sokka"
  },
  {
    id: 14,
    question: "¿Quién es el maestro que le enseñó esgrima a Sokka?",
    options: ["Bumi", "Piandao", "Pakku", "Jeong Jeong"],
    correctIndex: 1,
    nation: "fuego",
    character: "sokka"
  },
  {
    id: 15,
    question: "¿Cómo se llama el grupo de guerreras que lidera Suki?",
    options: ["Las Guerreras del Sol", "Las Guerreras Kyoshi", "Las Maestras Arena", "Las Amazonas de la Tierra"],
    correctIndex: 1,
    nation: "tierra",
    character: "suki"
  },
  {
    id: 16,
    question: "¿Qué tipo de animal gigante es Appa?",
    options: ["Bisonte Volador", "León Tortuga", "Oso Nandu", "Dragón de Viento"],
    correctIndex: 0,
    nation: "aire",
    character: "appa"
  },
  {
    id: 17,
    question: "¿Qué fruta le encanta robar y comer a Momo?",
    options: ["Manzanas de la Tierra", "Bayas de Fuego", "Cerezas lunares", "Frutas de durazno"],
    correctIndex: 3,
    nation: "aire",
    character: "momo"
  },
  {
    id: 18,
    question: "¿Cuál es el té favorito de Iroh?",
    options: ["Té de Ginseng", "Té de Raíz de Loto", "Té de Jazmín", "Té de la Flor de la Muerte"],
    correctIndex: 2,
    nation: "fuego",
    character: "iroh"
  },
  {
    id: 19,
    question: "¿Quién era el espíritu guardián de la gran biblioteca oculta en el desierto?",
    options: ["Hei Bai", "Wan Shi Tong", "Koh", "El Espíritu del Océano"],
    correctIndex: 1,
    nation: "aire",
    character: "momo"
  },
  {
    id: 20,
    question: "¿Cómo se llama el grupo de control mental y policía secreta de Ba Sing Se?",
    options: ["La Guardia Real", "Los Agentes del Loto Blanco", "El Dai Li", "Los Ojos de la Tierra"],
    correctIndex: 2,
    nation: "tierra",
    character: "azula"
  },
  {
    id: 21,
    question: "¿Cuál es la debilidad de Toph en el combate?",
    options: ["Los ruidos fuertes", "No poder tocar el suelo (arena floja o estar suspendida)", "El frío extremo", "El fuego control directo"],
    correctIndex: 1,
    nation: "tierra",
    character: "toph"
  },
  {
    id: 22,
    question: "¿Quién fue el primer amor de Sokka?",
    options: ["Suki", "Katara", "Yue", "Ty Lee"],
    correctIndex: 2,
    nation: "agua",
    character: "sokka"
  },
  {
    id: 23,
    question: "¿Qué criatura enseñó originalmente el Fuego Control a los humanos?",
    options: ["Los Leones Tortuga", "Los Dragones", "Los Bisontes Voladores", "Los Tejones-Topo"],
    correctIndex: 1,
    nation: "fuego",
    character: "zuko"
  },
  {
    id: 24,
    question: "¿Qué criatura enseñó originalmente el Tierra Control?",
    options: ["Los Tejones-Topo", "Los Dragones", "Los Bisontes Voladores", "La Luna"],
    correctIndex: 0,
    nation: "tierra",
    character: "toph"
  },
  {
    id: 25,
    question: "¿Qué criatura enseñó originalmente el Aire Control?",
    options: ["Los Bisontes Voladores", "Los Dragones", "Los Lémures", "El Viento Estelar"],
    correctIndex: 0,
    nation: "aire",
    character: "aang"
  },
  {
    id: 26,
    question: "¿Qué o quién enseñó originalmente el Agua Control?",
    options: ["Los Peces Koi", "La Luna y las Mareas", "El Mar de los Espíritus", "Los Dragones de Agua"],
    correctIndex: 1,
    nation: "agua",
    character: "katara"
  },
  {
    id: 27,
    question: "¿Cuál es la comida que Sokka intenta cazar constantemente en el primer episodio?",
    options: ["Pescado", "Un oso-pato", "Carne de alce", "Bayas silvestres"],
    correctIndex: 0,
    nation: "agua",
    character: "sokka"
  },
  {
    id: 28,
    question: "¿Cómo se llama el barco en el que viaja Zuko durante la primera temporada?",
    options: ["El Wani", "El Dragon Rojo", "El Destructor de Fuego", "El Ascua"],
    correctIndex: 0,
    nation: "fuego",
    character: "zuko"
  },
  {
    id: 29,
    question: "¿Quién es el líder de los Combatientes de la Libertad en el Libro 1?",
    options: ["Bumi", "Haru", "Jet", "Pipsqueak"],
    correctIndex: 2,
    nation: "tierra",
    character: "sokka"
  },
  {
    id: 30,
    question: "¿Qué elemento es capaz de bloquear el flujo de Chi a través del cuerpo?",
    options: ["El Metal Control", "El Bloqueo de Chi (estilo Ty Lee)", "El Relámpago", "El Agua de la Vida"],
    correctIndex: 1,
    nation: "fuego",
    character: "ty_lee"
  },
  {
    id: 31,
    question: "¿Cómo se llama el avatar que nació inmediatamente antes que Roku?",
    options: ["Kuruk", "Kyoshi", "Yangchen", "Szeto"],
    correctIndex: 1,
    nation: "tierra",
    character: "suki"
  },
  {
    id: 32,
    question: "¿Cuántos años estuvo Aang congelado en el iceberg?",
    options: ["50 años", "100 años", "150 años", "200 años"],
    correctIndex: 1,
    nation: "aire",
    character: "aang"
  },
  {
    id: 33,
    question: "¿Cuál es el color de las llamas que genera Azula?",
    options: ["Rojas", "Verdes", "Azules", "Blancas"],
    correctIndex: 2,
    nation: "fuego",
    character: "azula"
  },
  {
    id: 34,
    question: "¿Cuál es el verdadero nombre de la Maestra Agua del Sur que ayuda a Katara en la prisión?",
    options: ["Hama", "Kanna", "Kya", "Yue"],
    correctIndex: 0,
    nation: "agua",
    character: "katara"
  },
  {
    id: 35,
    question: "¿Qué tipo de control prohibido descubre Hama?",
    options: ["Lava Control", "Sangre Control", "Metal Control", "Rayo Control"],
    correctIndex: 1,
    nation: "agua",
    character: "katara"
  },
  {
    id: 36,
    question: "¿Quién es el Avatar de la Tribu Agua que luchó contra el espíritu Koh, el robacaras?",
    options: ["Kuruk", "Kyoshi", "Roku", "Aang"],
    correctIndex: 0,
    nation: "agua",
    character: "iroh"
  },
  {
    id: 37,
    question: "¿Cómo se llama la madre de Zuko y Azula?",
    options: ["Ursa", "Kya", "Kanna", "Mai"],
    correctIndex: 0,
    nation: "fuego",
    character: "zuko"
  },
  {
    id: 38,
    question: "¿Qué fruta le regala Aang a Katara en la primera temporada?",
    options: ["Baya de agua", "Melocotón de la suerte", "Una baya de goji", "Una fruta de maracuyá"],
    correctIndex: 1,
    nation: "aire",
    character: "aang"
  },
  {
    id: 39,
    question: "¿En qué libro Aang aprende Fuego Control?",
    options: ["Libro 1: Agua", "Libro 2: Tierra", "Libro 3: Fuego", "No lo aprende en la serie"],
    correctIndex: 2,
    nation: "fuego",
    character: "aang"
  },
  {
    id: 40,
    question: "¿Cuál es el juego de mesa favorito del tío Iroh?",
    options: ["Gow", "El Pai Sho", "Ajedrez de las Naciones", "Dados de Fuego"],
    correctIndex: 1,
    nation: "fuego",
    character: "iroh"
  },
  {
    id: 41,
    question: "¿Qué miembro del Loto Blanco es conocido como el 'Espadachín de la Nación del Fuego'?",
    options: ["Piandao", "Pakku", "Bumi", "Jeong Jeong"],
    correctIndex: 0,
    nation: "fuego",
    character: "sokka"
  },
  {
    id: 42,
    question: "¿Cómo se llama el dragón que acompaña espiritualmente al Avatar Roku?",
    options: ["Fang", "Druk", "Ran", "Shaw"],
    correctIndex: 0,
    nation: "fuego",
    character: "iroh"
  },
  {
    id: 43,
    question: "¿Cómo se llama la pequeña criatura espíritu que protege el bosque de Senlin y se enoja por la deforestación?",
    options: ["Hei Bai", "Koh", "Bumi", "Wan Shi Tong"],
    correctIndex: 0,
    nation: "tierra",
    character: "aang"
  },
  {
    id: 44,
    question: "¿Qué técnica del Loto Blanco usaron para reconquistar Ba Sing Se?",
    options: ["Combustión Masiva", "Ataque combinado de las cuatro naciones", "Infiltración oculta", "Pai Sho Estratégico"],
    correctIndex: 1,
    nation: "tierra",
    character: "iroh"
  },
  {
    id: 45,
    question: "¿Cómo llama Sokka a su espada de meteorito negra?",
    options: ["Espada Espacial", "Bumerán de Acero", "Loto Negro", "Corta Viento"],
    correctIndex: 0,
    nation: "agua",
    character: "sokka"
  },
  {
    id: 46,
    question: "¿De qué color es la flecha en la cabeza de los maestros aire?",
    options: ["Azul marino", "Celeste brillante", "Gris", "Amarillo claro"],
    correctIndex: 1,
    nation: "aire",
    character: "aang"
  },
  {
    id: 47,
    question: "¿Qué elemento aprende Aang después del Aire?",
    options: ["Fuego", "Tierra", "Agua", "Metal"],
    correctIndex: 2,
    nation: "agua",
    character: "aang"
  },
  {
    id: 48,
    question: "¿Quién enseña Tierra Control a Aang?",
    options: ["Bumi", "Toph", "Haru", "Roku"],
    correctIndex: 1,
    nation: "tierra",
    character: "toph"
  },
  {
    id: 49,
    question: "¿Quién enseña Agua Control a Aang y Katara en el Norte?",
    options: ["Hama", "Pakku", "Yue", "Kanna"],
    correctIndex: 1,
    nation: "agua",
    character: "katara"
  },
  {
    id: 50,
    question: "¿Qué técnica de fuego inventó el tío Iroh tras observar a los Maestros Agua?",
    options: ["Generación de relámpagos", "Redirección de relámpagos", "Fuego frío", "Llama danzante"],
    correctIndex: 1,
    nation: "fuego",
    character: "iroh"
  }
];

// This function expands our 50 base questions to a full array of 210 questions.
// It generates trivia dynamically on-the-fly, ensuring the application has exactly 200+
// questions as requested, each mapped to a nation and a character weight.
export function generateAllQuestions() {
  const feedbackById = {
    1: "Iroh recibió el título de Dragón del Oeste por sus victorias como general y por la leyenda de que derrotó al último dragón.",
    2: "Katara y Sokka crecieron en la Tribu Agua del Sur, donde Hakoda lideraba a los guerreros de la tribu.",
    3: "El rey Bumi gobierna Omashu, la ciudad del Reino Tierra famosa por sus toboganes de entrega y sus pruebas excéntricas.",
    4: "Momo es un lémur alado. Aang lo encuentra en el Templo del Aire del Sur al comienzo de su viaje.",
    5: "Toph inventa el metal control al sentir las impurezas de tierra dentro de una jaula metálica y doblarlas desde dentro.",
    6: "Azula es la hermana menor de Zuko y una prodigiosa maestra fuego que usa llamas azules.",
    7: "El bumerán es el arma inseparable de Sokka; incluso derrota al Hombre Combustión golpeando su tatuaje de la frente.",
    8: "Roku, nacido en la Nación del Fuego, fue el Avatar inmediatamente anterior a Aang y amigo de Sozin.",
    9: "El Templo del Aire del Sur estaba habitado por monjes; Aang vivió allí y fue alumno del monje Gyatso.",
    10: "Iroh creó la redirección de rayos al estudiar el movimiento circular y fluido de los maestros agua.",
    11: "Toph llama a Aang 'Pies Ligeros' porque sus pasos apenas le transmiten vibraciones a través del suelo.",
    12: "Yue se sacrifica para devolverle la vida al Espíritu de la Luna y se transforma en la nueva Luna.",
    13: "La espada de Sokka fue forjada por Piandao con un meteorito; por eso Sokka la llama su espada espacial.",
    14: "Piandao es el maestro espadachín de Sokka y demuestra que puede ser un gran guerrero sin dominar ningún elemento.",
    15: "Suki lidera a las Guerreras Kyoshi, protectoras entrenadas en el estilo de combate de la Avatar Kyoshi.",
    16: "Appa es un bisonte volador, compañero animal de Aang y descendiente de los primeros maestros aire.",
    17: "Momo tiene una debilidad cómica por los duraznos y llega a robarlos cada vez que puede.",
    18: "El té de jazmín es la bebida favorita de Iroh y acompaña muchos de sus momentos de calma y sabiduría.",
    19: "Wan Shi Tong, el búho que todo lo sabe, custodia la biblioteca perdida en medio del desierto de Si Wong.",
    20: "El Dai Li es la policía secreta de Ba Sing Se; mantiene el control del Reino Tierra mediante propaganda y lavado de cerebro.",
    21: "Toph percibe el mundo con vibraciones en el suelo, así que pierde esa ventaja si no puede tocar una superficie firme.",
    22: "Yue fue el primer amor de Sokka; su despedida bajo la luna es una de las escenas más memorables del Libro Agua.",
    23: "Los dragones fueron los primeros maestros fuego. Aang y Zuko aprenden de Ran y Shaw una visión del fuego como vida.",
    24: "Los tejones-topo enseñaron tierra control a los humanos; Oma y Shu aprendieron de ellos según la leyenda.",
    25: "Los bisontes voladores inspiraron el aire control de los nómadas del aire, incluido Aang.",
    26: "Los primeros maestros agua observaron cómo la Luna empuja y tira de las mareas para aprender su control.",
    27: "En el primer episodio, Sokka intenta pescar para ayudar a su tribu, aunque Katara termina rompiendo el iceberg.",
    28: "Zuko recorre el mundo en el Wani mientras persigue al Avatar junto a Iroh durante el Libro Agua.",
    29: "Jet lidera a los Combatientes de la Libertad y planea inundar una aldea para expulsar a la Nación del Fuego.",
    30: "Ty Lee usa bloqueo de chi: golpea puntos específicos para impedir temporalmente que una persona controle su elemento.",
    31: "Kyoshi precede a Roku en el ciclo Avatar y es recordada por su longevidad, su firmeza y la creación de su isla.",
    32: "Aang permaneció cien años en animación suspendida dentro del iceberg, mientras la guerra continuaba sin él.",
    33: "Las llamas azules de Azula muestran su precisión y su dominio excepcional del fuego control.",
    34: "Hama, una maestra agua de la Tribu del Sur, enseña a Katara técnicas que desarrolló tras ser capturada.",
    35: "Hama inventó el sangre control durante la luna llena al descubrir que también podía manipular el agua presente en los cuerpos.",
    36: "Kuruk enfrentó a Koh, el robacaras, tras perder a su prometida Ummi por culpa del espíritu.",
    37: "Ursa es la madre de Zuko y Azula; su historia explica parte de las heridas familiares de Zuko.",
    38: "Aang regala a Katara un melocotón de la suerte, un detalle pequeño que revela el cariño que le tiene.",
    39: "Aang aprende fuego control en el Libro Fuego, primero con Zuko y finalmente con los dragones Ran y Shaw.",
    40: "El Pai Sho es el juego estratégico favorito de Iroh y también sirve como código de reconocimiento del Loto Blanco.",
    41: "Piandao es un maestro de espada de la Nación del Fuego y miembro del Loto Blanco.",
    42: "Fang es el dragón de Roku; permanece junto a él incluso durante la erupción que destruye su isla.",
    43: "Hei Bai protege el bosque y ataca a los humanos después de que la Nación del Fuego lo destruye.",
    44: "El Loto Blanco reúne maestros de distintas naciones para liberar Ba Sing Se al final de la guerra.",
    45: "Sokka bautiza su arma como espada espacial porque está hecha con el metal oscuro de un meteorito.",
    46: "Las flechas celestes de Aang son tatuajes de maestro aire y brillan cuando entra en el Estado Avatar.",
    47: "Después del aire, Aang aprende agua control con Katara y el maestro Pakku en el Polo Norte.",
    48: "Toph acepta enseñar tierra control a Aang tras ganar juntos la batalla contra los maestros de la arena.",
    49: "El maestro Pakku enseña agua control en la Tribu Agua del Norte y acaba reconociendo el talento de Katara.",
    50: "Iroh redirige los rayos en vez de resistirlos: guía la energía por el cuerpo y la expulsa por el otro brazo."
  };

  const books = [
    { name: "Libro Agua", nation: "agua", episodes: bookWaterEpisodes },
    { name: "Libro Tierra", nation: "tierra", episodes: bookEarthEpisodes },
    { name: "Libro Fuego", nation: "fuego", episodes: bookFireEpisodes }
  ];
  const quizCharacters = ["aang", "katara", "sokka", "toph", "zuko", "iroh", "suki", "ty_lee"];
  const allEpisodes = books.flatMap((book) => book.episodes.map((episode) => ({ ...episode, book })));

  const episodeQuestions = allEpisodes.flatMap(({ title, desc, id, book }, index) => {
    const bookOptions = books.map(({ name }) => name);
    const titleOptions = [title, ...allEpisodes
      .filter((episode) => episode.title !== title)
      .slice((index * 3) % (allEpisodes.length - 3), ((index * 3) % (allEpisodes.length - 3)) + 3)
      .map((episode) => episode.title)];
    const orderedTitles = [...titleOptions.slice(index % 4), ...titleOptions.slice(0, index % 4)];

    return [
      {
        id: 51 + index * 2,
        question: `¿A qué libro pertenece el episodio '${title}'?`,
        options: bookOptions,
        correctIndex: bookOptions.indexOf(book.name),
        nation: book.nation,
        character: quizCharacters[index % quizCharacters.length],
        feedback: `'${title}' es el episodio ${id} del ${book.name}.`
      },
      {
        id: 52 + index * 2,
        question: `¿Qué episodio se resume así? ${desc}`,
        options: orderedTitles,
        correctIndex: orderedTitles.indexOf(title),
        nation: book.nation,
        character: quizCharacters[(index + 3) % quizCharacters.length],
        feedback: `La descripción corresponde a '${title}', episodio ${id} del ${book.name}.`
      }
    ];
  });

  const numberQuestions = allEpisodes.slice(0, 28).map(({ title, id, book }, index) => {
    const options = [id, ((id % 21) + 1), (((id + 6) % 21) + 1), (((id + 12) % 21) + 1)]
      .filter((value, position, array) => array.indexOf(value) === position);
    while (options.length < 4) options.push(options.length + 1);
    const orderedOptions = options.sort((a, b) => a - b).map(String);
    return {
      id: 173 + index,
      question: `¿Qué número de episodio es '${title}' en el ${book.name}?`,
      options: orderedOptions,
      correctIndex: orderedOptions.indexOf(String(id)),
      nation: book.nation,
      character: quizCharacters[(index + 5) % quizCharacters.length],
      feedback: `'${title}' ocupa el episodio ${id} del ${book.name}.`
    };
  });

  // 50 preguntas de trivia + 122 sobre los 61 episodios + 28 de orden = 200 exactas.
  return [
    ...baseQuestions.map((question) => ({ ...question, feedback: feedbackById[question.id] })),
    ...episodeQuestions,
    ...numberQuestions
  ];

  /* Banco procedural anterior, conservado temporalmente como referencia.
     Las preguntas del quiz se limitan a las curadas de arriba. */

  const allQuestions = [...baseQuestions];
  
  // Lists of data to generate questions procedurally
  const nations = ["agua", "tierra", "fuego", "aire"];
  const characters = ["aang", "katara", "toph", "zuko", "sokka", "iroh", "suki", "appa"];
  
  const episodesInfo = [
    { title: "El niño en el iceberg", book: "Agua", num: 1 },
    { title: "El regreso del Avatar", book: "Agua", num: 2 },
    { title: "El Templo del Aire del Sur", book: "Agua", num: 3 },
    { title: "Los guerreros de Kyoshi", book: "Agua", num: 4 },
    { title: "El rey de Omashu", book: "Agua", num: 5 },
    { title: "Prisionera", book: "Agua", num: 6 },
    { title: "Solsticio de Invierno", book: "Agua", num: 7 },
    { title: "El Templo del Avatar Roku", book: "Agua", num: 8 },
    { title: "El desertor", book: "Fuego/Agua", num: 16 },
    { title: "El Trono del Norte", book: "Agua", num: 19 },
    { title: "El estado Avatar", book: "Tierra", num: 1 },
    { title: "La cueva de los dos amantes", book: "Tierra", num: 2 },
    { title: "El retorno a Omashu", book: "Tierra", num: 3 },
    { title: "El pantano", book: "Tierra", num: 4 },
    { title: "El día del avatar", book: "Tierra", num: 5 },
    { title: "La bandida ciega", book: "Tierra", num: 6 },
    { title: "Zuko solitario", book: "Tierra", num: 7 },
    { title: "La persecución", book: "Tierra", num: 8 },
    { title: "El trabajo en metal", book: "Tierra", num: 9 },
    { title: "La biblioteca", book: "Tierra", num: 10 },
    { title: "El desierto", book: "Tierra", num: 11 },
    { title: "El paso de la serpiente", book: "Tierra", num: 12 },
    { title: "El taladro", book: "Tierra", num: 13 },
    { title: "La ciudad de muros y secretos", book: "Tierra", num: 14 },
    { title: "El rey de la tierra", book: "Tierra", num: 18 },
    { title: "El gurú", book: "Tierra", num: 19 },
    { title: "Las encrucijadas del destino", book: "Tierra", num: 20 },
    { title: "El despertar", book: "Fuego", num: 1 },
    { title: "El lazo de la playa", book: "Fuego", num: 5 },
    { title: "El Avatar y el Señor del Fuego", book: "Fuego", num: 6 },
    { title: "La fugitiva", book: "Fuego", num: 7 },
    { title: "La titiritera", book: "Fuego", num: 8 },
    { title: "Pesadillas y ensueños", book: "Fuego", num: 9 },
    { title: "El día del sol negro", book: "Fuego", num: 10 },
    { title: "El templo del aire del oeste", book: "Fuego", num: 12 },
    { title: "Los maestros del fuego control", book: "Fuego", num: 13 },
    { title: "La roca hirviente", book: "Fuego", num: 14 },
    { title: "Los actores de la isla Ember", book: "Fuego", num: 17 },
    { title: "El cometa de Sozin", book: "Fuego", num: 18 }
  ];

  const characterBending = {
    "Aang": { main: "Aire", element: "aire", char: "aang" },
    "Katara": { main: "Agua", element: "agua", char: "katara" },
    "Toph": { main: "Tierra", element: "tierra", char: "toph" },
    "Zuko": { main: "Fuego", element: "fuego", char: "zuko" },
    "Azula": { main: "Fuego", element: "fuego", char: "azula" },
    "Iroh": { main: "Fuego", element: "fuego", char: "iroh" },
    "Ozai": { main: "Fuego", element: "fuego", char: "zuko" },
    "Bumi": { main: "Tierra", element: "tierra", char: "toph" },
    "Pakku": { main: "Agua", element: "agua", char: "katara" },
    "Hama": { main: "Agua", element: "agua", char: "katara" },
    "Roku": { main: "Fuego", element: "fuego", char: "iroh" },
    "Kyoshi": { main: "Tierra", element: "tierra", char: "suki" },
    "Kuruk": { main: "Agua", element: "agua", char: "sokka" },
    "Yangchen": { main: "Aire", element: "aire", char: "aang" }
  };

  let idCounter = baseQuestions.length + 1;

  // 1. Generate questions about episode books (39 questions)
  episodesInfo.forEach((ep) => {
    const wrongBooks = ["Agua", "Tierra", "Fuego", "Aire"].filter(b => b !== ep.book);
    // Shuffle wrong books
    const options = [ep.book, wrongBooks[0], wrongBooks[1], wrongBooks[2]].sort(() => Math.random() - 0.5);
    const correctIndex = options.indexOf(ep.book);
    const nation = ep.book.toLowerCase().includes("fuego") ? "fuego" : ep.book.toLowerCase().includes("agua") ? "agua" : ep.book.toLowerCase().includes("tierra") ? "tierra" : "aire";

    allQuestions.push({
      id: idCounter++,
      question: `¿A qué Libro de la serie pertenece el episodio titulado '${ep.title}'?`,
      options: options,
      correctIndex: correctIndex,
      nation: nation,
      character: characters[idCounter % characters.length]
    });
  });

  // 2. Generate questions about character bending (14 questions)
  Object.entries(characterBending).forEach(([charName, data]) => {
    const options = ["Agua Control", "Tierra Control", "Fuego Control", "Aire Control"];
    const targetBending = `${data.main} Control`;
    const correctIndex = options.indexOf(targetBending);

    allQuestions.push({
      id: idCounter++,
      question: `¿Cuál es el tipo de control principal de ${charName}?`,
      options: options,
      correctIndex: correctIndex,
      nation: data.element,
      character: data.char
    });
  });

  // 3. Generate questions about who fights whom or trivia facts (100+ questions to reach exactly 210)
  const facts = [
    { q: "¿Quién de ellos NO es maestro control?", o: ["Sokka", "Katara", "Aang", "Toph"], c: "Sokka", n: "agua", ch: "sokka" },
    { q: "¿Cuál es el color distintivo de la Nación del Fuego?", o: ["Rojo", "Azul", "Verde", "Amarillo"], c: "Rojo", n: "fuego", ch: "zuko" },
    { q: "¿Cuál es el color distintivo del Reino de la Tierra?", o: ["Verde", "Rojo", "Azul", "Blanco"], c: "Verde", n: "tierra", ch: "toph" },
    { q: "¿Cuál es el color distintivo de la Tribu Agua?", o: ["Azul", "Verde", "Rojo", "Naranja"], c: "Azul", n: "agua", ch: "katara" },
    { q: "¿Cuál es el color distintivo de los Nómadas del Aire?", o: ["Naranja y Amarillo", "Rojo y Negro", "Azul y Blanco", "Verde y Café"], c: "Naranja y Amarillo", n: "aire", ch: "aang" },
    { q: "¿Cómo se llama el carismático vendedor de comida que aparece constantemente?", o: ["El vendedor de repollos", "El chef de fideos", "El pescador", "El maestro del té"], c: "El vendedor de repollos", n: "tierra", ch: "sokka" },
    { q: "¿Quién destruye casi siempre el puesto del vendedor de repollos?", o: ["El Equipo Avatar", "La Nación del Fuego", "El Dai Li", "Los piratas"], c: "El Equipo Avatar", n: "aire", ch: "appa" },
    { q: "¿Qué instrumento toca Aang de forma escandalosa?", o: ["El cuerno de bisonte", "La flauta de aire", "El tambor de trueno", "El arpa de agua"], c: "El cuerno de bisonte", n: "aire", ch: "aang" },
    { q: "¿Con qué elemento purifica Iroh el agua en el desierto para hacer té?", o: ["Fuego Control", "Agua Control", "No la purifica, usa cactus", "Tierra Control"], c: "Fuego Control", n: "fuego", ch: "iroh" },
    { q: "¿De qué color es el planeador de Aang?", o: ["Amarillo y naranja", "Rojo y blanco", "Verde y café", "Azul oscuro"], c: "Amarillo y naranja", n: "aire", ch: "aang" },
    { q: "¿Cuál de estos personajes tiene un planeador mecánico propio?", o: ["Teo", "Sokka", "Haru", "Jet"], c: "Teo", n: "aire", ch: "aang" },
    { q: "¿Quién es el padre de Sokka y Katara?", o: ["Hakoda", "Bato", "Pakku", "Arnook"], c: "Hakoda", n: "agua", ch: "sokka" },
    { q: "¿Cómo se llama el amigo de Hakoda que está herido en el Libro 2?", o: ["Bato", "Jet", "Haru", "Sokka"], c: "Bato", n: "agua", ch: "katara" },
    { q: "¿Qué criatura usa la cazadora de recompensas June para rastrear?", o: ["Un Shirshu", "Un lobo-diente de sable", "Un tejón-topo", "Un dragón"], c: "Un Shirshu", n: "tierra", ch: "zuko" },
    { q: "¿Cómo rastrea el Shirshu a sus presas?", o: ["Por el olfato (con su gran hocico-lengua)", "Por la vista térmica", "Por ondas sísmicas", "Por telepatía"], c: "Por el olfato (con su gran hocico-lengua)", n: "tierra", ch: "appa" },
    { q: "¿De qué nación es el Avatar Yangchen?", o: ["Nómadas del Aire", "Tribu Agua", "Reino de la Tierra", "Nación del Fuego"], c: "Nómadas del Aire", n: "aire", ch: "aang" },
    { q: "¿De qué nación es el Avatar Kuruk?", o: ["Tribu Agua", "Nómadas del Aire", "Reino de la Tierra", "Nación del Fuego"], c: "Tribu Agua", n: "agua", ch: "katara" },
    { q: "¿De qué nación es el Avatar Kyoshi?", o: ["Reino de la Tierra", "Tribu Agua", "Nómadas del Aire", "Nación del Fuego"], c: "Reino de la Tierra", n: "tierra", ch: "suki" },
    { q: "¿De qué nación es el Avatar Roku?", o: ["Nación del Fuego", "Reino de la Tierra", "Tribu Agua", "Nómadas del Aire"], c: "Nación del Fuego", n: "fuego", ch: "iroh" },
    { q: "¿Quién de ellos formó el Loto Blanco?", o: ["Es una orden antigua y secreta multnacional", "El rey Bumi", "El Avatar Roku", "El tío Iroh"], c: "Es una orden antigua y secreta multnacional", n: "loto", nOverride: "aire", ch: "iroh" },
    { q: "¿Cuál es el símbolo del Loto Blanco usado en el Pai Sho?", o: ["La flor de loto blanca", "El loto negro", "El círculo del Avatar", "La estrella de fuego"], c: "La flor de loto blanca", n: "fuego", ch: "iroh" },
    { q: "¿En qué isla se refugia el Equipo Avatar en el Libro 3?", o: ["Isla Ember", "Isla Kyoshi", "Isla de la Media Luna", "Isla de la Roca"], c: "Isla Ember", n: "fuego", ch: "zuko" },
    { q: "¿Qué obra de teatro ven los protagonistas en el Libro 3?", o: ["Los actores de la Isla Ember", "La leyenda del Avatar", "El triunfo del Señor del Fuego", "Amor en la cueva"], c: "Los actores de la Isla Ember", n: "fuego", ch: "sokka" },
    { q: "¿Cómo se llama el grupo de teatro que parodia al Equipo Avatar?", o: ["Los actores de la Isla Ember", "La compañía real del fuego", "El teatro de Ba Sing Se", "Los bufones del aire"], c: "Los actores de la Isla Ember", n: "fuego", ch: "sokka" },
    { q: "¿Cuál de estos personajes se disfraza del Espíritu de la Dama Pintada?", o: ["Katara", "Toph", "Suki", "Yue"], c: "Katara", n: "agua", ch: "katara" },
    { q: "¿Qué hacía la Dama Pintada por el pueblo pesquero de Jang Hui?", o: ["Los limpiaba de la contaminación y les daba comida", "Los defendía con fuego azul", "Los transportaba en nubes", "Hacía llover monedas"], c: "Los limpiaba de la contaminación y les daba comida", n: "agua", ch: "katara" },
    { q: "¿Cómo se llama el dragón del Señor del Fuego Sozin?", o: ["No tenía dragón", "Fang", "Druk", "Ran"], c: "No tenía dragón", n: "fuego", ch: "zuko" },
    { q: "¿Cuál es el cometa que incrementa el poder de los Maestros Fuego?", o: ["El cometa de Sozin", "El cometa Halley", "El cometa de Roku", "El cometa del Dragón"], c: "El cometa de Sozin", n: "fuego", ch: "zuko" },
    { q: "¿Cada cuántos años pasa el cometa de Sozin?", o: ["Cada 100 años", "Cada 50 años", "Cada 150 años", "Cada 200 años"], c: "Cada 100 años", n: "fuego", ch: "iroh" },
    { q: "¿Quién derrotó finalmente al Hombre Combustión?", o: ["Sokka (con su bumerán)", "Aang", "Toph", "Zuko"], c: "Sokka (con su bumerán)", n: "agua", ch: "sokka" },
    { q: "¿Dónde golpeó el bumerán al Hombre Combustión para bloquear su poder?", o: ["En el ojo tatuado de la frente", "En el pecho", "En el pie metálico", "En el brazo de metal"], c: "En el ojo tatuado de la frente", n: "agua", ch: "sokka" },
    { q: "¿Cómo se llama el gurú que enseña a Aang a controlar el Estado Avatar?", o: ["Gurú Pathik", "Gurú Shinn", "Gurú del Aire", "Gurú Loto"], c: "Gurú Pathik", n: "aire", ch: "aang" },
    { q: "¿Dónde vivía el Gurú Pathik?", o: ["En el Templo del Aire del Este", "En el Pantano", "En Ba Sing Se", "En la Isla Kyoshi"], c: "En el Templo del Aire del Este", n: "aire", ch: "aang" },
    { q: "¿Cuántos chakras debe abrir Aang para dominar el Estado Avatar?", o: ["7 chakras", "4 chakras", "6 chakras", "8 chakras"], c: "7 chakras", n: "aire", ch: "aang" },
    { q: "¿Cuál es el último chakra que Aang debe abrir?", o: ["El Chakra del Pensamiento (apegos terrenales)", "El Chakra del Amor", "El Chakra de la Verdad", "El Chakra del Sonido"], c: "El Chakra del Pensamiento (apegos terrenales)", n: "aire", ch: "aang" },
    { q: "¿Qué le impedía a Aang abrir su último chakra?", o: ["Su amor y apego por Katara", "Su miedo al fuego control", "Su enojo con Zuko", "Su dolor por los nómadas del aire"], c: "Su amor y apego por Katara", n: "agua", ch: "aang" },
    { q: "¿Cómo se llama la prisión de máxima seguridad de la Nación del Fuego?", o: ["La Roca Hirviente", "La Fosa de Fuego", "La Prisión del Volcán", "El Abismo de Metal"], c: "La Roca Hirviente", n: "fuego", ch: "sokka" },
    { q: "¿Dónde está ubicada la prisión de la Roca Hirviente?", o: ["En medio de un lago hirviente en un cráter volcánico", "En el fondo del océano", "En el Templo del Aire del Oeste", "En la capital de la nación"], c: "En medio de un lago hirviente en un cráter volcánico", n: "fuego", ch: "zuko" },
    { q: "¿Quién ayuda a Sokka a infiltrarse en la Roca Hirviente?", o: ["Zuko", "Aang", "Toph", "Katara"], c: "Zuko", n: "fuego", ch: "zuko" },
    { q: "¿A quién iba a buscar Sokka originalmente a la Roca Hirviente?", o: ["A su padre Hakoda", "A Suki", "Al tío Iroh", "A Chit Sang"], c: "A su padre Hakoda", n: "agua", ch: "sokka" },
    { q: "¿A quién encuentra primero Sokka en la Roca Hirviente?", o: ["A Suki", "A su padre Hakoda", "A Chit Sang", "A Mai"], c: "A Suki", n: "tierra", ch: "sokka" },
    { q: "¿Quién traiciona a Azula en la Roca Hirviente por amor a Zuko?", o: ["Mai", "Ty Lee", "Suki", "Ursa"], c: "Mai", n: "fuego", ch: "zuko" },
    { q: "¿Quién defiende a Mai de la ira de Azula en la Roca Hirviente?", o: ["Ty Lee", "Zuko", "Sokka", "Los guardias"], c: "Ty Lee", n: "fuego", ch: "ty_lee" },
    { q: "¿Qué hace Ty Lee para defender a Mai frente a Azula?", o: ["Le bloquea el Chi de inmediato", "Le lanza fuego", "La empuja y corren", "Usa acrobacias para distraer"], c: "Le bloquea el Chi de inmediato", n: "fuego", ch: "ty_lee" },
    { q: "¿A qué grupo se unen Mai y Ty Lee tras el final de la serie?", o: ["Las Guerreras Kyoshi (Ty Lee) y el palacio (Mai)", "Los Maestros del Sol", "El Dai Li", "Los Combatientes de la Libertad"], c: "Las Guerreras Kyoshi (Ty Lee) y el palacio (Mai)", n: "tierra", ch: "ty_lee" },
    { q: "¿Cómo se llama la bestia de carga e híbrido gigante del Reino Tierra que monta el Equipo Avatar?", o: ["No montan ninguno, van en Appa", "Un rinoceronte de Komodo", "Un lagarto saltarín", "Un buey-toro"], c: "No montan ninguno, van en Appa", n: "aire", ch: "appa" },
    { q: "¿Qué habilidad única tiene Toph Beifong para detectar mentiras?", o: ["Siente las vibraciones del ritmo cardíaco y sudor en el suelo", "Usa telepatía espiritual", "Lee la expresión de los ojos", "Oye el tono de voz exacto"], c: "Siente las vibraciones del ritmo cardíaco y sudor en el suelo", n: "tierra", ch: "toph" },
    { q: "¿Quién es el primer personaje que descubre que Toph es ciega en la arena de combate?", o: ["Nadie, ella lo revela", "Aang (al flotar en el aire)", "Sokka", "Katara"], c: "Aang (al flotar en el aire)", n: "aire", ch: "aang" },
    { q: "¿Cuál de estos maestros tierra entrena a Aang para golpear la roca?", o: ["Toph", "Bumi", "Haru", "El maestro Yu"], c: "Toph", n: "tierra", ch: "toph" },
    { q: "¿Qué flor venenosa confunde Iroh con una flor de té de jazmín blanco?", o: ["El Loto Blanco", "El arbusto de la flor de la muerte (Macadamia silvestre)", "La flor del dragón blanco", "La dalia de fuego"], c: "La flor del dragón blanco", n: "fuego", ch: "iroh" }
  ];

  // Procedural padding to ensure we easily exceed 200 questions.
  // Each generated question is dynamic, has a real correct option and 3 incorrect options,
  // and is mapped to a nation/character.
  let factIndex = 0;
  while (allQuestions.length < 210 && factIndex < facts.length) {
    const f = facts[factIndex++];
    // Generate options dynamically
    const options = [f.c, ...f.o.filter(item => item !== f.c)].sort(() => Math.random() - 0.5);
    const correctIndex = options.indexOf(f.c);

    allQuestions.push({
      id: idCounter++,
      question: f.q,
      options: options,
      correctIndex: correctIndex,
      nation: f.nOverride || f.n,
      character: f.ch
    });
  }

  // If still under 210 (though we should be well above it), pad with extra programmatically generated items
  let paddingIndex = 1;
  while (allQuestions.length < 210) {
    const epNum = (paddingIndex % 20) + 1;
    const bookName = paddingIndex % 3 === 0 ? "Agua" : paddingIndex % 3 === 1 ? "Tierra" : "Fuego";
    const nat = bookName === "Agua" ? "agua" : bookName === "Tierra" ? "tierra" : "fuego";
    const char = characters[paddingIndex % characters.length];

    allQuestions.push({
      id: idCounter++,
      question: `¿Verdadero o Falso? El Libro ${bookName} contiene un episodio con el número correlativo ${epNum}.`,
      options: ["Verdadero", "Falso", "Depende de la edición", "No hay datos de este episodio"],
      correctIndex: 0,
      nation: nat,
      character: char
    });
    paddingIndex++;
  }

  return allQuestions;
}
