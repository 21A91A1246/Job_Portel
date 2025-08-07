// utils/suggestSkillsForJob.js
import { ROLE_SKILLS_MAP, KNOWN_SKILLS } from './Skills';

export const suggestSkillsForJob = (job) => {
  if (!job) return [];

  const normalize = (str) => str.toLowerCase().replace(/[\s-]/g, '');

  const matchedSkills = new Set();

  const role = normalize(job.jobRole || '');
  const desc = normalize(job.jobDescription || job.description || '');

  for (const title in ROLE_SKILLS_MAP) {
    const normalizedTitle = normalize(title);
    if (role.includes(normalizedTitle) || desc.includes(normalizedTitle)) {
      ROLE_SKILLS_MAP[title].forEach((skill) => matchedSkills.add(skill));
    }
  }

  KNOWN_SKILLS.forEach((skill) => {
    const normalizedSkill = normalize(skill);
    if (desc.includes(normalizedSkill)) {
      matchedSkills.add(skill);
    }
  });

  return Array.from(matchedSkills);
};
