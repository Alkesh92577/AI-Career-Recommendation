// ==========================================================
// CAREER RECOMMENDATION ENGINE
// ==========================================================

// Skill level scores
const LEVEL_SCORE = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  "1": 1,
  "2": 2,
  "3": 3
};

// ==========================================================
// CAREER SKILL REQUIREMENTS
// ==========================================================
//
// core:
//   Career ke main/important skills.
//   Core skills missing hone par career ko high score nahi milega.
//
// supporting:
//   Additional skills jo career match ko improve karti hain.
// ==========================================================

const CAREER_SKILLS = {
  "Software Developer": {
    core: ["C", "C++", "Java", "Python"],
    supporting: [
      "JavaScript",
      "SQL",
      "MySQL",
      "Spring Boot",
      "Node.js"
    ],
    description:
      "Strong programming fundamentals and software development skills."
  },

  "Java Backend Developer": {
    core: ["Java", "Spring Boot"],
    supporting: ["SQL", "MySQL", "MongoDB"],
    description:
      "Java, Spring Boot and database development skills."
  },

  "Web Developer": {
    core: ["HTML", "CSS", "JavaScript"],
    supporting: ["React", "Node.js", "MongoDB"],
    description:
      "Strong frontend and web development skills."
  },

  "Full Stack Developer": {
    core: ["JavaScript", "React"],
    supporting: [
      "HTML",
      "CSS",
      "Node.js",
      "MongoDB",
      "SQL"
    ],
    description:
      "Frontend and backend web development skills."
  },

  "Data Analyst": {
    core: ["Python", "SQL", "Data Analysis"],
    supporting: ["MySQL", "Machine Learning"],
    description:
      "Strong data analysis, Python and SQL skills."
  },

  "Machine Learning Engineer": {
    core: ["Python", "Machine Learning"],
    supporting: ["Data Analysis", "SQL"],
    description:
      "Python, machine learning and data analysis skills."
  },

  "Database Developer": {
    core: ["SQL", "MySQL"],
    supporting: ["MongoDB", "Python", "Data Analysis"],
    description:
      "Strong SQL, MySQL and database development skills."
  },

  "Data Engineer": {
    core: ["Python", "SQL"],
    supporting: ["MySQL", "MongoDB", "Data Analysis"],
    description:
      "Python, SQL and database/data processing skills."
  }
};


// ==========================================================
// NORMALIZE SKILL NAME
// ==========================================================

function normalizeSkillName(skillName) {
  if (!skillName) return "";

  return String(skillName)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}


// ==========================================================
// GET LEVEL SCORE
// ==========================================================

function getLevelScore(level) {
  if (level === null || level === undefined) {
    return 0;
  }

  const normalized = String(level)
    .trim()
    .toLowerCase();

  return LEVEL_SCORE[normalized] || 0;
}


// ==========================================================
// CREATE USER SKILL MAP
// ==========================================================

function createSkillMap(skills) {
  const skillMap = {};

  if (!Array.isArray(skills)) {
    return skillMap;
  }

  skills.forEach((skill) => {
    if (!skill) return;

    const skillName =
      skill.skillName ||
      skill.name ||
      skill.skill ||
      "";

    const normalizedName = normalizeSkillName(skillName);

    if (!normalizedName) return;

    const level =
      skill.level !== undefined
        ? skill.level
        : skill.skillLevel;

    const score = getLevelScore(level);

    // Agar same skill multiple times hai,
    // to highest level rakhenge.
    if (
      !skillMap[normalizedName] ||
      score > skillMap[normalizedName]
    ) {
      skillMap[normalizedName] = score;
    }
  });

  return skillMap;
}


// ==========================================================
// CALCULATE ONE CAREER SCORE
// ==========================================================

function calculateSingleCareerScore(skillMap, careerData) {
  const coreSkills = careerData.core || [];
  const supportingSkills = careerData.supporting || [];

  // --------------------------------------------------------
  // CORE SKILLS
  // --------------------------------------------------------

  let coreScore = 0;
  let matchedCoreSkills = [];

  coreSkills.forEach((skill) => {
    const normalized = normalizeSkillName(skill);
    const userScore = skillMap[normalized] || 0;

    if (userScore > 0) {
      coreScore += userScore;
      matchedCoreSkills.push({
        skill,
        levelScore: userScore
      });
    }
  });

  // --------------------------------------------------------
  // IMPORTANT RULE:
  // Specialized career ke liye core skill mandatory hai.
  //
  // Example:
  // Java Backend Developer
  // Core = Java + Spring Boot
  //
  // Agar Java aur Spring Boot dono nahi hain,
  // to sirf MySQL ki wajah se high score nahi milega.
  // --------------------------------------------------------

  if (matchedCoreSkills.length === 0) {
    return {
      score: 0,
      matchedSkills: [],
      missingSkills: [...coreSkills],
      matchedCoreSkills: [],
      matchedSupportingSkills: []
    };
  }


  // --------------------------------------------------------
  // CORE MATCH %
  // --------------------------------------------------------

  const maximumCoreScore = coreSkills.length * 3;

  const corePercentage =
    maximumCoreScore > 0
      ? (coreScore / maximumCoreScore) * 100
      : 0;


  // --------------------------------------------------------
  // SUPPORTING SKILLS
  // --------------------------------------------------------

  let supportingScore = 0;
  let matchedSupportingSkills = [];

  supportingSkills.forEach((skill) => {
    const normalized = normalizeSkillName(skill);
    const userScore = skillMap[normalized] || 0;

    if (userScore > 0) {
      supportingScore += userScore;

      matchedSupportingSkills.push({
        skill,
        levelScore: userScore
      });
    }
  });


  const maximumSupportingScore =
    supportingSkills.length * 3;

  const supportingPercentage =
    maximumSupportingScore > 0
      ? (supportingScore / maximumSupportingScore) * 100
      : 0;


  // --------------------------------------------------------
  // FINAL SCORE
  // --------------------------------------------------------
  //
  // Core skills ko 75% importance
  // Supporting skills ko 25% importance
  //
  // Isse specialized career ke important skills
  // zyada matter karenge.
  // --------------------------------------------------------

  let finalScore =
    corePercentage * 0.75 +
    supportingPercentage * 0.25;


  // --------------------------------------------------------
  // CORE COMPLETION PENALTY
  // --------------------------------------------------------
  //
  // Agar career ke core skills me se sirf ek available hai,
  // to score automatically limited rahega.
  // --------------------------------------------------------

  const coreCompletion =
    coreSkills.length > 0
      ? matchedCoreSkills.length / coreSkills.length
      : 0;

  finalScore = finalScore * coreCompletion;


  // --------------------------------------------------------
  // MISSING SKILLS
  // --------------------------------------------------------

  const missingSkills = [];

  [...coreSkills, ...supportingSkills].forEach(
    (skill) => {
      const normalized = normalizeSkillName(skill);

      if (!skillMap[normalized]) {
        missingSkills.push(skill);
      }
    }
  );


  return {
    score: Number(finalScore.toFixed(2)),

    matchedSkills: [
      ...matchedCoreSkills,
      ...matchedSupportingSkills
    ],

    missingSkills,

    matchedCoreSkills,

    matchedSupportingSkills
  };
}


// ==========================================================
// CALCULATE ALL CAREER SCORES
// ==========================================================

export function calculateCareerScores(skills) {
  const skillMap = createSkillMap(skills);

  const results = Object.entries(CAREER_SKILLS)
    .map(([career, careerData]) => {

      const result = calculateSingleCareerScore(
        skillMap,
        careerData
      );

      return {
        career,
        score: result.score,
        description: careerData.description,

        matchedSkills: result.matchedSkills,
        missingSkills: result.missingSkills,

        matchedCoreSkills:
          result.matchedCoreSkills,

        matchedSupportingSkills:
          result.matchedSupportingSkills
      };
    })
    .filter((career) => career.score > 0)
    .sort((a, b) => b.score - a.score);

  return results;
}


// ==========================================================
// GET BEST CAREER
// ==========================================================

export function getBestCareer(skills) {
  const results = calculateCareerScores(skills);

  if (results.length === 0) {
    return null;
  }

  return results[0];
}


// ==========================================================
// GET TOP CAREERS
// ==========================================================

export function getTopCareers(skills, count = 3) {
  const results = calculateCareerScores(skills);

  return results.slice(0, count);
}


// ==========================================================
// GET CAREER DESCRIPTION
// ==========================================================

export function getCareerDescription(career) {
  return CAREER_SKILLS[career]?.description || "";
}


// ==========================================================
// EXPORT CAREER DATA
// ==========================================================

export { CAREER_SKILLS };