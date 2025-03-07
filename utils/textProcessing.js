import { KeywordProcessor } from "flashtext";

const SKILL_LIST = ["JavaScript", "React", "Node.js", "Python", "Git", "HTML", "CSS", "Express", "MongoDB"];

export function extractSkills(text) {
  const keywordProcessor = new KeywordProcessor();
  SKILL_LIST.forEach(skill => keywordProcessor.addKeyword(skill.toLowerCase()));

  const extractedSkills = keywordProcessor.extractKeywords(text.toLowerCase());
  return [...new Set(extractedSkills.map(skill => skill.charAt(0).toUpperCase() + skill.slice(1)))];
}

export function extractName(text) {
  const nameMatch = text.match(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/);
  return nameMatch ? nameMatch[0] : "Unknown Name";
}
