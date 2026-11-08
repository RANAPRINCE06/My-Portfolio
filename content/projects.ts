import { Project } from '@/types/content';

export const projectList: Project[] = [
  {
    slug: 'roadwatch-ai',
    name: 'RoadWatch AI',
    shortDescription:
      'AI-powered road safety intelligence platform detecting hazards, predicting risk indices, and accelerating municipal repair workflows with real-time telemetry.',
    detailedOverview:
      'RoadWatch AI is a full-stack hazard detection and operational dispatch platform engineered for civic authorities. Developed for the Road Safety Hackathon 2026 (IIT Madras CoERS), it integrates computer vision models for surface defect classification with real-time Socket.IO telemetry and automated PDF incident report generation.',
    problemStatement:
      'Unreported road surface degradation and delayed municipal response cause thousands of preventable transit accidents annually. Traditional reporting relies on manual filing that takes weeks to process and triage.',
    solution:
      'A full-stack web dashboard integrating vision-based hazard tagging, real-time WebSocket state streaming, GPS-bound cluster visualization, and a streamlined administrative repair-dispatch lifecycle.',
    architectureHighlights: [
      'React & Vite frontend with responsive Tailwind CSS interface and dynamic telemetry mapping',
      'Express.js backend with Socket.IO for bidirectional live incident streaming',
      'Mongoose & MongoDB persistence for hazard coordinate records and inspection status',
      'Automated inspection manifest and citizen safety guide generation via PDFKit',
      'Google Gemini AI integration for situational risk assessment synthesis',
    ],
    category: 'AI & Machine Learning',
    status: 'active',
    technologies: [
      'React',
      'Vite',
      'Express.js',
      'Socket.IO',
      'MongoDB',
      'Google Gemini AI',
      'Tailwind CSS',
      'PDFKit',
    ],
    keyFeatures: [
      'Automated road defect classification',
      'Real-time WebSocket telemetry updates',
      'Municipal dispatch and repair lifecycle tracking',
      'Automated PDF incident report generation',
    ],
    metrics: [
      { label: 'Hackathon Track', value: 'IIT Madras CoERS 2026' },
      { label: 'Telemetry', value: 'Socket.IO Real-time' },
    ],
    githubUrl: 'https://github.com/RANAPRINCE06/ROADWATCH-AI',
    isFeatured: true,
    displayOrder: 1,
    evidenceSource: 'Verified GitHub repository (70+ source files, package.json dependencies, and hackathon documentation)',
    verificationStatus: 'verified',
  },
  {
    slug: 'ai-resume-analyzer',
    name: 'AI Resume Analyzer & Job Matcher',
    shortDescription:
      'Semantic NLP engine using Sentence-BERT, spaCy NER, and TF-IDF to evaluate ATS compatibility and automate skill-gap analysis.',
    detailedOverview:
      'An advanced NLP platform that parses multi-format candidate resumes, projects extracted skills against target job description requirements, and calculates granular ATS relevance scores. Employs Sentence-BERT (all-MiniLM-L6-v2) to understand contextual competency beyond simple keyword matching.',
    problemStatement:
      'Conventional ATS tools rely on rigid keyword matches, penalizing qualified applicants using alternative phrasing while failing to pinpoint specific conceptual skill gaps.',
    solution:
      'A multi-stage NLP analysis pipeline combining dense vector embeddings (SentenceTransformer all-MiniLM-L6-v2), spaCy named entity recognition (en_core_web_sm), and Scikit-learn TF-IDF scoring algorithms exposed via Flask REST endpoints.',
    architectureHighlights: [
      'Sentence-BERT embedding pipeline for high-dimensional cosine similarity evaluation',
      'spaCy NER and regex parsing for structured entity extraction (skills, tools, credentials)',
      'Flask-based microservice architecture deployed on Vercel with SQLite3 persistence',
      'Interactive client dashboard providing visual skill gap breakdowns and ATS score metrics',
    ],
    category: 'AI & Machine Learning',
    status: 'completed',
    technologies: [
      'Python',
      'Flask',
      'Sentence-Transformers',
      'spaCy',
      'Scikit-Learn',
      'NLTK',
      'SQLite3',
    ],
    keyFeatures: [
      'Multi-format resume parsing (PDF, DOCX, TXT)',
      'High-dimensional ATS semantic score calculation',
      'Automated technical and domain skill gap identification',
      'Role-to-competency alignment scoring',
    ],
    metrics: [
      { label: 'Embedding Model', value: 'all-MiniLM-L6-v2' },
      { label: 'Live Status', value: 'Verified HTTP 200' },
    ],
    githubUrl: 'https://github.com/RANAPRINCE06/ai-resume-analyzer',
    liveDemoUrl: 'https://ai-resume-analyzer-seven-bice.vercel.app',
    isFeatured: true,
    displayOrder: 2,
    evidenceSource: 'Verified GitHub repository (models/resume_analyzer.py) and active Vercel production deployment (HTTP 200)',
    verificationStatus: 'verified',
  },
  {
    slug: 'rescue-ai',
    name: 'RescueAI — Disaster Intelligence Platform',
    shortDescription:
      'Command Center platform orchestrating emergency response, damage prediction, and operational guidance with Google Gemini AI and live mapping.',
    detailedOverview:
      'RescueAI is a Command Center platform engineered to coordinate crisis management teams during natural disasters. Combines Google Maps geospatial visualization, real-time incident tracking with Firebase, Recharts data visualization, and Google GenAI situational guidance.',
    problemStatement:
      'During crisis scenarios, field commanders face information overload and lack rapid access to validated disaster response protocols tailored to live conditions.',
    solution:
      'An operational mapping interface that provides verified protocol recommendations, casualty tracking, and resource allocation dashboards for dispatch officers.',
    architectureHighlights: [
      'React & Vite frontend with Google Maps (@vis.gl/react-google-maps) interactive incident map',
      'Firebase backend integration for live incident state synchronization and authentication',
      'Google GenAI SDK integration for situational response recommendation synthesis',
      'Recharts integration for structural damage and resource consumption trends',
    ],
    category: 'AI & Machine Learning',
    status: 'prototype',
    technologies: [
      'React',
      'Vite',
      'Firebase',
      'Google Maps API',
      'Google Gemini AI',
      'Recharts',
      'Tailwind CSS',
    ],
    keyFeatures: [
      'Interactive geospatial incident mapping',
      'Real-time incident dispatch overview',
      'Structural damage risk assessment and charts',
      'AI situational response synthesis',
    ],
    metrics: [
      { label: 'Mapping', value: 'Google Maps API' },
      { label: 'Live Status', value: 'Verified HTTP 200' },
    ],
    githubUrl: 'https://github.com/RANAPRINCE06/RescueAI',
    liveDemoUrl: 'https://rescue-ai-nu.vercel.app',
    isFeatured: true,
    displayOrder: 3,
    evidenceSource: 'Verified GitHub repository (src/firebase.ts, package.json) and active Vercel deployment (HTTP 200)',
    verificationStatus: 'verified',
  },
  {
    slug: 'transport-management-system',
    name: 'Transport Management System (TMS)',
    shortDescription:
      'Full-stack logistics management platform with 15+ Express REST APIs, JWT authentication, SQLite3 persistence, and Helmet security.',
    detailedOverview:
      'A freight and transit operations management platform engineered with Node.js, Express.js, and SQLite3. Supports multi-tenant role-based permissions, automated vehicle dispatch schedules, driver allocations, and transit status tracking with rate limiting and security headers.',
    problemStatement:
      'Small to mid-sized transit operators struggle with paper-based manifest tracking, manual vehicle scheduling errors, and unauthorized status modifications.',
    solution:
      'A secure full-stack web application delivering role-based access control, relational SQLite storage, JWT session authentication, and automated scheduling workflows.',
    architectureHighlights: [
      '15+ RESTful endpoints structured with Express.js routing and middleware authentication',
      'SQLite3 relational storage with schema initialization scripts and parameterized queries',
      'Hardened security with Helmet.js headers, Bcrypt password hashing, and Express rate limiting',
      'File upload handling via Multer for transit documentation and driver verification records',
    ],
    category: 'Full-Stack Web',
    status: 'completed',
    technologies: [
      'Node.js',
      'Express.js',
      'SQLite3',
      'JWT',
      'Bcrypt',
      'Helmet.js',
      'Multer',
      'JavaScript',
    ],
    keyFeatures: [
      'Role-based access control (Admin, Dispatcher, Driver)',
      'Vehicle and driver route scheduling',
      'Secure JWT authentication and bcrypt credential hashing',
      'Transit manifest record management',
    ],
    metrics: [
      { label: 'REST APIs', value: '15+ Endpoints' },
      { label: 'Security', value: 'Helmet + JWT + Bcrypt' },
    ],
    githubUrl: 'https://github.com/RANAPRINCE06/Web-Project',
    isFeatured: false,
    displayOrder: 4,
    evidenceSource: 'Verified GitHub repository (server.js, package.json dependencies, setup-db.js)',
    verificationStatus: 'verified',
  },
  {
    slug: 'stadium-x',
    name: 'StadiumX',
    shortDescription:
      'Interactive venue seating and event management prototype built with React, Vite, Firebase, and Google GenAI.',
    detailedOverview:
      'An event ticketing and venue layout application allowing event organizers to configure seating tiers, manage admission zones, and provide attendees with an intuitive interactive seat selection experience.',
    problemStatement:
      'Complex seating layouts create confusion and high transaction abandonment in standard generic ticketing forms.',
    solution:
      'A componentized seating map interface with zone availability visualization, Firebase state persistence, and responsive booking flows.',
    architectureHighlights: [
      'React 19 & Vite frontend with Motion animations and Tailwind CSS layout',
      'Firebase backend integration for venue reservation state management',
      'Google GenAI SDK integration for attendee support and seating assistance',
    ],
    category: 'Full-Stack Web',
    status: 'prototype',
    technologies: ['React', 'Vite', 'Firebase', 'Google Gemini AI', 'Tailwind CSS', 'Motion'],
    keyFeatures: [
      'Interactive venue seating zone visualization',
      'Firebase cloud database integration',
      'Responsive mobile ticket selection flow',
    ],
    githubUrl: 'https://github.com/RANAPRINCE06/StadiumX',
    isFeatured: false,
    displayOrder: 5,
    evidenceSource: 'Verified GitHub repository (src/App.tsx, package.json)',
    verificationStatus: 'verified',
  },
  {
    slug: 'scalecart-microservices',
    name: 'ScaleCart — Microservices Platform (Case Study)',
    shortDescription:
      'Distributed e-commerce microservices architectural study in Java 21 & Spring Boot (extending open-source architecture by Ashifur Nahid).',
    detailedOverview:
      'An educational architectural study of distributed e-commerce microservices in Java 21 and Spring Boot. Based on and extending the open-source architecture by Ashifur Nahid, it examines service decomposition, API Gateway routing, Kafka messaging, PostgreSQL persistence, and Redis caching.',
    problemStatement:
      'Understanding failure isolation, distributed transactions, and event consistency across decomposed enterprise microservices.',
    solution:
      'A multi-service platform demonstrating an API Gateway, Eureka service discovery, centralized configuration, and asynchronous Kafka order messaging.',
    architectureHighlights: [
      'Spring Cloud API Gateway for dynamic routing and authentication filtering',
      'Apache Kafka event streaming for asynchronous order-inventory message passing',
      'PostgreSQL database schemas with Docker Compose orchestration',
      'Transparent attribution acknowledging base architecture by Ashifur Nahid',
    ],
    category: 'Distributed Systems & Backend',
    status: 'active',
    technologies: [
      'Java 21',
      'Spring Boot',
      'Apache Kafka',
      'PostgreSQL',
      'Redis',
      'Docker',
    ],
    keyFeatures: [
      'Service discovery and centralized configuration',
      'Asynchronous event-driven messaging with Kafka',
      'Docker Compose multi-service deployment topology',
    ],
    metrics: [
      { label: 'Attribution', value: 'Extends open-source base' },
      { label: 'Runtime', value: 'Java 21' },
    ],
    githubUrl: 'https://github.com/RANAPRINCE06/scalecart-microservices',
    isFeatured: false,
    displayOrder: 6,
    evidenceSource: 'Verified GitHub repository (docs/system-reanalysis.md and README attribution)',
    verificationStatus: 'verified',
  },
];
