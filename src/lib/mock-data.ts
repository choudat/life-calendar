import { CalendarCategory, LifeEvent } from "@/types/calendar";

export const MOCK_BIRTHDATE = new Date("1907-01-15");

export const MOCK_CALENDARS: CalendarCategory[] = [
  { id: "family", title: "Famille", color: "bg-blue-500", isVisible: true },
  { id: "career", title: "Carrière & Études", color: "bg-indigo-600", isVisible: true },
  { id: "history", title: "Histoire", color: "bg-red-500", isVisible: true },
  { id: "projects", title: "Grands Projets", color: "bg-amber-600", isVisible: true },
  { id: "travel", title: "Voyages", color: "bg-emerald-500", isVisible: true },
];

export const MOCK_EVENTS: LifeEvent[] = [
  // --- NAISSANCE & DÉCÈS ---
  {
    id: "birth",
    calendarId: "family",
    title: "Naissance de Raymon",
    startDate: MOCK_BIRTHDATE,
    icon: "👶",
  },
  {
    id: "death",
    calendarId: "family",
    title: "Décès de Raymon",
    startDate: new Date("2009-11-20"),
    icon: "🪦",
  },

  // --- HISTOIRE ---
  {
    id: "ww1",
    calendarId: "history",
    title: "Première Guerre Mondiale",
    startDate: new Date("1914-07-28"),
    endDate: new Date("1918-11-11"),
    icon: "🎖️",
  },
  {
    id: "ww2",
    calendarId: "history",
    title: "Seconde Guerre Mondiale",
    startDate: new Date("1939-09-01"),
    endDate: new Date("1945-09-02"),
    icon: "🎖️",
  },
  {
    id: "resistance",
    calendarId: "history",
    title: "Résistance",
    startDate: new Date("1941-01-01"),
    endDate: new Date("1944-08-25"),
    description: "Engagement dans la résistance française",
    icon: "✊",
  },

  // --- FAMILLE (Frères/Soeurs) ---
  {
    id: "brother",
    calendarId: "family",
    title: "Naissance de Marcel",
    startDate: new Date("1909-05-12"),
    description: "Son frère cadet",
    icon: "👦",
  },
  {
    id: "sister1",
    calendarId: "family",
    title: "Naissance de Germaine",
    startDate: new Date("1911-08-23"),
    description: "Sa première sœur",
    icon: "👧",
  },
  {
    id: "sister2",
    calendarId: "family",
    title: "Naissance de Lucienne",
    startDate: new Date("1913-02-14"),
    description: "Sa benjamine",
    icon: "👧",
  },
  // --- NEVEUX & NIÈCES ---
  // Enfants de Marcel
  { id: "nephew1", calendarId: "family", title: "Naissance de Jean", startDate: new Date("1935-03-12"), description: "Fils de Marcel", icon: "👶" },
  { id: "nephew3", calendarId: "family", title: "Naissance de Louis", startDate: new Date("1937-11-05"), description: "Fils de Marcel", icon: "👶" },
  { id: "nephew6", calendarId: "family", title: "Naissance de Claire", startDate: new Date("1940-05-14"), description: "Fille de Marcel", icon: "👶" },
  // Enfants de Germaine
  { id: "nephew2", calendarId: "family", title: "Naissance de René", startDate: new Date("1936-07-24"), description: "Fils de Germaine", icon: "👶" },
  { id: "nephew5", calendarId: "family", title: "Naissance de Marc", startDate: new Date("1939-09-30"), description: "Fils de Germaine", icon: "👶" },
  { id: "nephew8", calendarId: "family", title: "Naissance de Sophie (Nièce)", startDate: new Date("1942-08-22"), description: "Fille de Germaine", icon: "👶" },
  // Enfants de Lucienne
  { id: "nephew4", calendarId: "family", title: "Naissance de Pierre (Neveu)", startDate: new Date("1938-02-18"), description: "Fils de Lucienne", icon: "👶" },
  { id: "nephew7", calendarId: "family", title: "Naissance de Marie (Nièce)", startDate: new Date("1941-12-03"), description: "Fille de Lucienne", icon: "👶" },
  { id: "nephew9", calendarId: "family", title: "Naissance d'Anne", startDate: new Date("1944-04-17"), description: "Fille de Lucienne", icon: "👶" },
  { id: "nephew10", calendarId: "family", title: "Naissance de Luc", startDate: new Date("1946-01-30"), description: "Fils de Lucienne", icon: "👶" },

  // --- FAMILLE (Mariages & Enfants) ---
  {
    id: "marriage1",
    calendarId: "family",
    title: "Mariage avec Marie",
    startDate: new Date("1930-06-15"),
    description: "Sa première épouse",
    icon: "💍",
  },
  {
    id: "child1",
    calendarId: "family",
    title: "Naissance de Pierre",
    startDate: new Date("1931-04-10"),
    description: "Fils aîné avec Marie",
    icon: "🍼",
  },
  {
    id: "child2",
    calendarId: "family",
    title: "Naissance de Paul",
    startDate: new Date("1934-09-20"),
    description: "Second fils avec Marie",
    icon: "🍼",
  },
  {
    id: "marriage2",
    calendarId: "family",
    title: "Mariage avec Jeanne",
    startDate: new Date("1946-05-20"),
    description: "Sa seconde épouse",
    icon: "💍",
  },
  {
    id: "child3",
    calendarId: "family",
    title: "Naissance de Jacques",
    startDate: new Date("1947-03-15"),
    description: "Premier enfant avec Jeanne",
    icon: "🍼",
  },
  {
    id: "child4",
    calendarId: "family",
    title: "Naissance de Catherine",
    startDate: new Date("1949-11-02"),
    description: "Fille aînée avec Jeanne",
    icon: "🍼",
  },
  {
    id: "child5",
    calendarId: "family",
    title: "Naissance d'Isabelle",
    startDate: new Date("1952-07-14"),
    description: "Benjamine avec Jeanne",
    icon: "🍼",
  },
  {
    id: "marriage3",
    calendarId: "family",
    title: "Mariage avec Solange",
    startDate: new Date("1965-08-10"),
    description: "Sa troisième épouse",
    icon: "💍",
  },
  // --- PETITS-ENFANTS ---
  // Enfants de Pierre
  { id: "gk1", calendarId: "family", title: "Naissance de Sophie", startDate: new Date("1958-03-10"), description: "Fille de Pierre", icon: "🧸" },
  { id: "gk2", calendarId: "family", title: "Naissance de Thomas", startDate: new Date("1960-06-25"), description: "Fils de Pierre", icon: "🧸" },
  { id: "gk3", calendarId: "family", title: "Naissance de Julien", startDate: new Date("1963-11-14"), description: "Fils de Pierre", icon: "🧸" },
  // Enfants de Paul
  { id: "gk4", calendarId: "family", title: "Naissance de Nicolas", startDate: new Date("1962-09-05"), description: "Fils de Paul", icon: "🧸" },
  { id: "gk5", calendarId: "family", title: "Naissance de Marie", startDate: new Date("1965-02-28"), description: "Fille de Paul", icon: "🧸" },
  // Enfants de Jacques
  { id: "gk6", calendarId: "family", title: "Naissance de Lucas", startDate: new Date("1975-07-12"), description: "Fils de Jacques", icon: "🧸" },
  { id: "gk7", calendarId: "family", title: "Naissance d'Emma", startDate: new Date("1978-04-23"), description: "Fille de Jacques", icon: "🧸" },
  // Enfants de Catherine
  { id: "gk8", calendarId: "family", title: "Naissance de Chloé", startDate: new Date("1976-01-30"), description: "Fille de Catherine", icon: "🧸" },
  { id: "gk9", calendarId: "family", title: "Naissance de Théo", startDate: new Date("1979-10-15"), description: "Fils de Catherine", icon: "🧸" },
  { id: "gk10", calendarId: "family", title: "Naissance de Léa", startDate: new Date("1982-05-08"), description: "Fille de Catherine", icon: "🧸" },

  // --- ARRIÈRE-PETITS-ENFANTS ---
  { id: "ggk1", calendarId: "family", title: "Naissance de Hugo", startDate: new Date("1985-09-20"), description: "Fils de Sophie (Petite-fille)", icon: "🐣" },
  { id: "ggk2", calendarId: "family", title: "Naissance de Camille", startDate: new Date("1988-12-12"), description: "Fille de Thomas (Petit-fils)", icon: "🐣" },
  { id: "ggk3", calendarId: "family", title: "Naissance d'Arthur", startDate: new Date("1990-07-04"), description: "Fils de Nicolas (Petit-fils)", icon: "🐣" },
  { id: "ggk4", calendarId: "family", title: "Naissance de Léo", startDate: new Date("2005-03-15"), description: "Fils de Lucas (Petit-fils)", icon: "🐣" },
  { id: "ggk5", calendarId: "family", title: "Naissance de Manon", startDate: new Date("2006-11-28"), description: "Fille de Chloé (Petite-fille)", icon: "🐣" },

  // --- CARRIÈRE & ÉTUDES ---
  {
    id: "childhood-country",
    calendarId: "career",
    title: "Enfance à la campagne",
    startDate: new Date("1907-01-15"),
    endDate: new Date("1923-01-15"),
    icon: "🚜",
  },
  {
    id: "work-start",
    calendarId: "career",
    title: "Début vie active",
    startDate: new Date("1923-01-16"),
    description: "Commence à travailler à 16 ans",
    icon: "🔨",
  },
  {
    id: "studies-welder",
    calendarId: "career",
    title: "Études Soudeur",
    startDate: new Date("1928-09-01"), // 21 ans
    endDate: new Date("1932-06-30"), // 25 ans
    icon: "🎓",
  },
  {
    id: "job-welder",
    calendarId: "career",
    title: "Soudeur",
    startDate: new Date("1932-07-01"),
    endDate: new Date("1945-01-01"),
    icon: "👨‍🏭",
  },
  {
    id: "job-foreman",
    calendarId: "career",
    title: "Contremaître",
    startDate: new Date("1945-02-01"),
    endDate: new Date("1950-01-01"),
    icon: "👷",
  },
  {
    id: "studies-cnam",
    calendarId: "career",
    title: "Ingénieur CNAM",
    startDate: new Date("1950-01-01"),
    endDate: new Date("1954-06-01"),
    description: "Formation continue",
    icon: "🎓",
  },
  {
    id: "job-engineer",
    calendarId: "career",
    title: "Bureau des Méthodes",
    startDate: new Date("1954-07-01"),
    endDate: new Date("1972-01-01"), // Retraite à 65 ans
    icon: "📐",
  },

  // --- GRANDS PROJETS ---
  {
    id: "proj-cherbourg",
    calendarId: "projects",
    title: "Bateaux Cherbourg",
    startDate: new Date("1935-01-01"),
    endDate: new Date("1938-01-01"),
    icon: "🚢",
  },
  {
    id: "proj-toulon",
    calendarId: "projects",
    title: "Sous-marins Toulon",
    startDate: new Date("1948-01-01"),
    endDate: new Date("1950-01-01"),
    icon: "⚓",
  },
  {
    id: "proj-tancarville",
    calendarId: "projects",
    title: "Pont de Tancarville",
    startDate: new Date("1955-11-15"),
    endDate: new Date("1959-07-02"),
    icon: "🌉",
  },
  {
    id: "proj-millau",
    calendarId: "projects",
    title: "Viaduc de Millau",
    startDate: new Date("2001-10-16"),
    endDate: new Date("2004-12-14"),
    description: "Consultant expert (94 ans !)",
    icon: "🌉",
  },

  // --- VOYAGES ---
  {
    id: "trip-tunis",
    calendarId: "travel",
    title: "Tunis",
    startDate: new Date("1951-06-01"),
    endDate: new Date("1951-06-15"),
    icon: "🇹🇳",
  },
  {
    id: "trip-alger",
    calendarId: "travel",
    title: "Alger",
    startDate: new Date("1953-05-01"),
    endDate: new Date("1953-05-20"),
    icon: "🇩🇿",
  },
  {
    id: "trip-barcelona",
    calendarId: "travel",
    title: "Barcelone",
    startDate: new Date("1962-08-01"),
    endDate: new Date("1962-08-15"),
    icon: "🇪🇸",
  },
  {
    id: "trip-berlin",
    calendarId: "travel",
    title: "Berlin",
    startDate: new Date("1975-09-01"),
    endDate: new Date("1975-09-10"),
    icon: "🇩🇪",
  },
  {
    id: "trip-tokyo",
    calendarId: "travel",
    title: "Tokyo",
    startDate: new Date("1982-04-01"),
    endDate: new Date("1982-04-20"),
    icon: "🇯🇵",
  },
  {
    id: "trip-belize",
    calendarId: "travel",
    title: "Belize",
    startDate: new Date("1995-02-01"),
    endDate: new Date("1995-02-15"),
    icon: "🇧🇿",
  },
];
