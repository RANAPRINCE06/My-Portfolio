import { personalProfile } from './profile';
import { educationList } from './education';
import { experienceList } from './experience';
import { projectList } from './projects';
import { technicalSkillsList } from './skills';
import { certificationList } from './certifications';
import { achievementList } from './achievements';
import { hackathonList } from './hackathons';
import { competitiveProgrammingProfiles } from './competitive-programming';
import { socialLinks } from './social-links';

import {
  PersonalProfileSchema,
  EducationSchema,
  ExperienceSchema,
  ProjectSchema,
  TechnicalSkillSchema,
  CertificationSchema,
  AchievementSchema,
  HackathonSchema,
  CompetitiveProgrammingProfileSchema,
  SocialProfileSchema,
} from '@/lib/validation/content-schemas';

export {
  personalProfile,
  educationList,
  experienceList,
  projectList,
  technicalSkillsList,
  certificationList,
  achievementList,
  hackathonList,
  competitiveProgrammingProfiles,
  socialLinks,
};

/**
 * Validates all static content against Zod domain schemas.
 * Returns true if all content is valid, or throws descriptive validation errors.
 */
export function validateAllContent(): { valid: boolean; summary: Record<string, number> } {
  // 1. Profile
  PersonalProfileSchema.parse(personalProfile);

  // 2. Education
  educationList.forEach((edu) => EducationSchema.parse(edu));

  // 3. Experience
  experienceList.forEach((exp) => ExperienceSchema.parse(exp));

  // 4. Projects
  projectList.forEach((proj) => ProjectSchema.parse(proj));

  // 5. Skills
  technicalSkillsList.forEach((skill) => TechnicalSkillSchema.parse(skill));

  // 6. Certifications
  certificationList.forEach((cert) => CertificationSchema.parse(cert));

  // 7. Achievements
  achievementList.forEach((ach) => AchievementSchema.parse(ach));

  // 8. Hackathons
  hackathonList.forEach((hack) => HackathonSchema.parse(hack));

  // 9. Competitive Programming
  competitiveProgrammingProfiles.forEach((cp) =>
    CompetitiveProgrammingProfileSchema.parse(cp)
  );

  // 10. Social Links
  socialLinks.forEach((soc) => SocialProfileSchema.parse(soc));

  return {
    valid: true,
    summary: {
      profile: 1,
      education: educationList.length,
      experience: experienceList.length,
      projects: projectList.length,
      skills: technicalSkillsList.length,
      certifications: certificationList.length,
      achievements: achievementList.length,
      hackathons: hackathonList.length,
      competitiveProgramming: competitiveProgrammingProfiles.length,
      socials: socialLinks.length,
    },
  };
}

