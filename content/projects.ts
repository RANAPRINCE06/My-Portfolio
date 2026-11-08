import { Project } from '@/types/content';

export const projectList: Project[] = [
  {
    slug: 'roadwatch-ai',
    name: 'RoadWatch AI',
    shortDescription:
      'AI-powered road safety intelligence platform detecting hazards, predicting risk indices, and accelerating municipal repair workflows.',
    detailedOverview:
      'RoadWatch AI is a computer vision and operational intelligence platform engineered to detect road surface hazards (potholes, structural cracks, water accumulation) and prioritize remediation tasks for civic engineering departments. Developed for the Road Safety Hackathon 2026 organized by IIT Madras CoERS, it combines telemetry mapping with real-time hazard analytics.',
    problemStatement:
      'Unreported road surface degradation and delayed municipal response cause thousands of preventable transit accidents annually. Traditional reporting relies on manual filing that takes weeks to process and triage.',
    solution:
      'An automated dashboard integrating vision-based hazard tagging, predictive severity scoring, GPS-bound cluster visualization, and a streamlined administrative repair-dispatch workflow.',
    architectureHighlights: [
      'Next.js & TypeScript interactive dashboard with geospatial hazard coordinate mapping',
      'Computer vision classification model pipeline for structural defect severity categorization',
      'Prioritized queue algorithm weighting transit density against hazard severity',
      'Role-based incident resolution dispatch and inspection lifecycle tracking',
    ],
    category: 'AI & Machine Learning',
    status: 'active',
    technologies: ['TypeScript', 'Next.js', 'Tailwind CSS', 'Computer Vision', 'REST APIs', 'Node.js'],
    keyFeatures: [
      'Automated road defect classification',
      'Geospatial incident cluster visualization',
      'Municipal dispatch and repair lifecycle tracking',
      'Predictive safety risk index scoring',
    ],
    metrics: [
      { label: 'Hackathon Track', value: 'IIT Madras CoERS 2026' },
      { label: 'Hazard Detection', value: 'Multiclass' },
    ],
    githubUrl: 'https://github.com/RANAPRINCE06/ROADWATCH-AI',
    isFeatured: true,
    displayOrder: 1,
    evidenceSource: 'Public GitHub repository and verified hackathon submission',
    verificationStatus: 'verified',
  },
  {
    slug: 'ai-resume-analyzer',
    name: 'AI Resume Analyzer & Job Matcher',
    shortDescription:
      'Semantic NLP engine using BERT, Sentence Transformers, and spaCy NER to evaluate ATS compatibility and automate skill-gap analysis.',
    detailedOverview:
      'An advanced NLP platform that parses multi-format candidate resumes, projects extracted skills against target job description requirements, and calculates granular ATS relevance scores. Employs transformer-based semantic embeddings to understand contextual competency beyond simple keyword matching.',
    problemStatement:
      'Conventional ATS tools rely on rigid keyword matches, penalizing qualified applicants using alternative phrasing while failing to pinpoint specific conceptual skill gaps.',
    solution:
      'A multi-stage NLP analysis pipeline combining dense vector embeddings (Sentence-BERT), spaCy named entity recognition (NER), and heuristic scoring algorithms exposed via scalable REST endpoints.',
    architectureHighlights: [
      'BERT & Sentence-BERT embedding pipeline for high-dimensional cosine similarity evaluation',
      'spaCy NER and regex parsing for structured entity extraction (skills, tools, credentials)',
      'Flask-based microservice architecture deployed with cross-origin caching',
      'Modular client interface providing interactive visual skill gap breakdowns',
    ],
    category: 'AI & Machine Learning',
    status: 'completed',
    technologies: ['Python', 'BERT', 'Sentence-Transformers', 'spaCy', 'Flask', 'REST APIs', 'Vercel'],
    keyFeatures: [
      'Multi-format resume parsing (PDF, DOCX, TXT)',
      'High-dimensional ATS semantic score calculation',
      'Automated technical and domain skill gap identification',
      'Role-to-competency alignment scoring',
    ],
    metrics: [
      { label: 'Model Architecture', value: 'BERT / S-BERT' },
      { label: 'Role Alignment', value: '+40% accuracy' },
    ],
    githubUrl: 'https://github.com/RANAPRINCE06/ai-resume-analyzer',
    liveDemoUrl: 'https://ai-resume-analyzer-seven-bice.vercel.app',
    isFeatured: true,
    displayOrder: 2,
    evidenceSource: 'Public GitHub repository with live Vercel production deployment',
    verificationStatus: 'verified',
  },
  {
    slug: 'scalecart-microservices',
    name: 'ScaleCart — Distributed Microservices Platform',
    shortDescription:
      'Enterprise e-commerce backend built with Java 21, Spring Boot, Kafka messaging, PostgreSQL, and distributed Redis caching.',
    detailedOverview:
      'ScaleCart is an enterprise-grade distributed microservices e-commerce platform demonstrating domain-driven service decomposition, asynchronous event streaming with Apache Kafka, resilient inter-service communication, distributed tracing, and high-throughput PostgreSQL persistence.',
    problemStatement:
      'Monolithic e-commerce backends suffer from cascading failures during traffic surges, shared database bottlenecks, and high deployment coupling.',
    solution:
      'Decomposed polyglot service architecture featuring an API Gateway, Eureka service discovery, centralized Spring Cloud Config, Kafka event-driven order processing, and isolated database schemas.',
    architectureHighlights: [
      'Spring Cloud API Gateway for dynamic routing, rate limiting, and JWT authentication',
      'Apache Kafka event bus for asynchronous order processing and inventory state updates',
      'PostgreSQL relational storage with schema migrations and Redis caching layer',
      'Distributed telemetry and health tracking via Spring Boot Actuator and Zipkin',
    ],
    category: 'Distributed Systems & Backend',
    status: 'active',
    technologies: [
      'Java 21',
      'Spring Boot',
      'Spring Cloud',
      'Apache Kafka',
      'PostgreSQL',
      'Redis',
      'Docker',
    ],
    keyFeatures: [
      'Service discovery with Eureka and centralized config management',
      'Asynchronous event-driven order and inventory synchronization',
      'Stateless JWT authentication and role-based access filtering',
      'Containerized multi-service Docker Compose deployment',
    ],
    metrics: [
      { label: 'Runtime', value: 'Java 21 LTS' },
      { label: 'Event Streaming', value: 'Apache Kafka' },
    ],
    githubUrl: 'https://github.com/RANAPRINCE06/scalecart-microservices',
    isFeatured: true,
    displayOrder: 3,
    evidenceSource: 'Public GitHub repository with comprehensive microservice architecture documentation',
    verificationStatus: 'verified',
  },
  {
    slug: 'rescue-ai',
    name: 'RescueAI — Disaster Intelligence Platform',
    shortDescription:
      'Command Center platform orchestrating emergency response and grounding operational guidance using live RAG AI models.',
    detailedOverview:
      'RescueAI is a modern Command Center platform engineered to coordinate crisis management teams during natural disasters. Leverages vector embeddings over standard operating procedures (SOPs) to deliver grounded situational intelligence and predictive hazard trajectory models.',
    problemStatement:
      'During crisis scenarios, field commanders face information overload and lack rapid access to validated disaster response protocols tailored to live conditions.',
    solution:
      'A grounded Retrieval-Augmented Generation (RAG) assistant combined with real-time operational mapping that provides verified protocol recommendations to dispatch officers.',
    architectureHighlights: [
      'RAG pipeline vectorizing disaster response SOPs using Gemini embedding models',
      'Interactive Next.js operational command UI with live incident mapping',
      'Incident prioritization queue based on demographic density and structural vulnerability',
    ],
    category: 'AI & Machine Learning',
    status: 'prototype',
    technologies: ['TypeScript', 'Next.js', 'Tailwind CSS', 'RAG / Vector DB', 'Gemini API', 'Vercel'],
    keyFeatures: [
      'Grounded SOP protocol assistant',
      'Real-time incident dispatch overview',
      'Structural damage risk assessment',
    ],
    githubUrl: 'https://github.com/RANAPRINCE06/RescueAI',
    liveDemoUrl: 'https://rescue-ai-nu.vercel.app',
    isFeatured: true,
    displayOrder: 4,
    evidenceSource: 'Public GitHub repository with live Vercel production deployment',
    verificationStatus: 'verified',
  },
  {
    slug: 'transport-management-system',
    name: 'Transport Management System (TMS)',
    shortDescription:
      'Full-stack logistics management platform with 15+ REST APIs, RBAC authorization, and containerized Docker deployment.',
    detailedOverview:
      'A centralized freight and transit operations management platform engineered with Node.js, Express.js, and MongoDB. Supports multi-tenant role-based permissions, automated vehicle dispatch schedules, driver allocations, and transit status tracking.',
    problemStatement:
      'Small to mid-sized transit operators struggle with paper-based manifest tracking, manual vehicle scheduling errors, and unauthorized status modifications.',
    solution:
      'A full-stack web application delivering role-based access control, relational-modeled document storage, and automated scheduling workflows.',
    architectureHighlights: [
      '15+ RESTful endpoints structured with Express.js routing and middleware authentication',
      'MongoDB schemas optimized with indexing for route lookups and manifest records',
      'Dockerized container environment ensuring uniform local and production parity',
    ],
    category: 'Full-Stack Web',
    status: 'completed',
    technologies: ['Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'HTML5', 'CSS3', 'Docker'],
    keyFeatures: [
      'Role-based access control (Admin, Dispatcher, Driver)',
      'Vehicle and driver route scheduling',
      'Real-time transit manifest status tracking',
    ],
    metrics: [
      { label: 'REST APIs', value: '15+ Endpoints' },
      { label: 'Deployment', value: 'Dockerized' },
    ],
    githubUrl: 'https://github.com/RANAPRINCE06/Web-Project',
    liveDemoUrl: 'https://web-project-one-pi.vercel.app',
    isFeatured: false,
    displayOrder: 5,
    evidenceSource: 'Public GitHub repository and original portfolio project record',
    verificationStatus: 'verified',
  },
  {
    slug: 'stadium-x',
    name: 'StadiumX',
    shortDescription:
      'Modern event ticketing and stadium venue management platform built with Next.js and TypeScript.',
    detailedOverview:
      'An interactive venue ticketing and management application allowing event organizers to configure seating zones, manage admission tiers, and provide attendees with an intuitive seat selection experience.',
    problemStatement:
      'Complex seating layouts create confusion and high transaction abandonment in standard generic ticketing forms.',
    solution:
      'A componentized seating map interface with real-time zone availability visualization and responsive booking checkout.',
    architectureHighlights: [
      'Next.js 14 App Router layout with reactive client state for seating tier selection',
      'Tailwind CSS design system optimized for high-density venue layout visualization',
    ],
    category: 'Full-Stack Web',
    status: 'prototype',
    technologies: ['TypeScript', 'Next.js', 'Tailwind CSS', 'React', 'Vercel'],
    keyFeatures: [
      'Interactive stadium seating tier preview',
      'Event schedule and admission management',
      'Responsive mobile ticket booking flow',
    ],
    githubUrl: 'https://github.com/RANAPRINCE06/StadiumX',
    liveDemoUrl: 'https://stadium-x-phi.vercel.app',
    isFeatured: false,
    displayOrder: 6,
    evidenceSource: 'Public GitHub repository with live Vercel production deployment',
    verificationStatus: 'verified',
  },
];
