import { PersonalProfile } from '@/types/content';
import { socialLinks } from './social-links';

export const personalProfile: PersonalProfile = {
  name: 'Prince Rana',
  headline: 'Software Development Engineer & AI Specialist',
  role: 'Software Engineer | Full-Stack Systems & Artificial Intelligence',
  shortBio:
    'Computer Science & Engineering undergraduate specializing in Artificial Intelligence at Parul University. Passionate about solving complex algorithmic challenges, engineering distributed backend architectures, and productionizing intelligent AI systems.',
  longBio: [
    'I am a Software Development Engineer and Computer Science undergrad with a specialization in Artificial Intelligence. My engineering core is driven by Data Structures & Algorithms, distributed systems architecture, and intelligent model integration.',
    'With over 400+ problems solved across LeetCode, Codeforces Specialist status (1461), and CodeChef 3-Star ranking (1606), I focus heavily on writing highly optimized, clean, and mathematically rigorous code.',
    'My practical development experience spans modern full-stack web applications with Next.js, Node.js, and Java Spring Boot microservices, to deep NLP matching engines using BERT and sentence transformers.',
  ],
  location: 'Vadodara, Gujarat, India',
  avatarUrl: '/Prince.jpeg',
  resumeUrl: 'https://drive.google.com/file/d/1DHnDQO2bxOzOrXtnM3FL8peH4Rg7DzlG/view?usp=sharing',
  status: {
    isAvailableForWork: true,
    availabilityNotice: 'Open to Software Engineering (SDE) Internships & Co-op Roles',
  },
  socials: socialLinks,
};

