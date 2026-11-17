import { Project } from '@/types/content';

export const projectList: Project[] = [
  {
    slug: 'payrecover-ai',
    name: 'PayRecover AI',
    shortDescription:
      'Autonomous revenue recovery engine with multi-agent triage, human-in-the-loop safety guardrails, and deterministic payment failure remediation.',
    detailedOverview:
      'PayRecover AI is an enterprise payment recovery architecture engineered with FastAPI, PostgreSQL, Redis, and Google Gemini AI. It orchestrates autonomous multi-agent workflows to categorize transaction declines, diagnose root causes (insufficient funds vs network timeout vs bank downtime), and execute personalized recovery actions while maintaining strict human-in-the-loop approval thresholds for high-value transactions.',
    problemStatement:
      'Failed merchant transactions result in billions in lost revenue annually. Generic retry webhooks trigger repeated card declines, degrade merchant reputation, and lead to churn without actionable customer resolution.',
    solution:
      'An intelligent revenue recovery pipeline employing specialized agentic workers (Triage, Analysis, Strategy, Dispatch) coupled with Redis event queues, stateful PostgreSQL ledgering, and safety gates that request manual sign-off before dispatching high-impact financial reminders.',
    architectureHighlights: [
      'FastAPI asynchronous REST service handling real-time webhook ingestion with rate-limiting and idempotency guards',
      'Multi-agent workflow orchestration with Google Gemini API synthesizing customer risk context and tailored outreach',
      'Redis pub/sub queue for backoff-scheduled event retries and cache-isolated webhook verification',
      'PostgreSQL relational schema tracking end-to-end recovery audit trails, state transitions, and recovery analytics',
      'Human-in-the-loop safety guardrails enforcing manual verification gates for high-value invoices or sensitive merchant tiers',
    ],
    engineeringDecisions: [
      'Decoupled webhook ingestion from recovery decision loops using Redis queues to guarantee <50ms acknowledgement and prevent gateway timeouts.',
      'Enforced deterministic human-in-the-loop approval thresholds for transaction values exceeding merchant-configured limits before dispatching customer actions.',
      'Employed structured JSON schemas with Google Gemini API for reliable diagnostic failure root-cause categorization.',
    ],
    challenges: [
      'Handling idempotent webhook retries during upstream payment provider network jitter without duplicate charge or reminder dispatches.',
      'Maintaining transaction state consistency across Redis event queues and PostgreSQL persistence layer.',
    ],
    category: 'Distributed Systems & Backend',
    status: 'active',
    technologies: [
      'FastAPI',
      'Python',
      'Google Gemini AI',
      'PostgreSQL',
      'Redis',
      'Docker',
      'SQLAlchemy',
      'Pydantic',
    ],
    keyFeatures: [
      'Autonomous multi-agent failure triage & classification',
      'Human-in-the-loop safety approval workflows',
      'Deterministic retry backoff & webhook idempotency',
      'End-to-end recovery audit logging & telemetry',
    ],
    metrics: [
      { label: 'Architecture', value: 'Multi-Agent Pipeline' },
      { label: 'Safety Gates', value: 'Human-in-the-Loop' },
    ],
    githubUrl: 'https://github.com/RANAPRINCE06/payrecover-ai',
    isFeatured: true,
    displayOrder: 1,
    evidenceSource: 'Verified backend architectural design and multi-agent workflow specification',
    verificationStatus: 'verified',
    architectureDiagramType: 'agent-pipeline',
  },
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
    engineeringDecisions: [
      'Architected bidirectional WebSocket telemetry using Socket.IO to push live incident coordinates without client polling overhead.',
      'Utilized Google Gemini API for situational risk index assessment while anchoring defect taxonomy in verified municipal repair catalogs.',
      'Separated real-time volatile telemetry from persistent inspection manifests stored in MongoDB.',
    ],
    challenges: [
      'Eliminating duplicate hazard clustering from concurrent crowd-sourced submissions near identical GPS coordinates.',
      'Ensuring continuous WebSocket reconnection resilience under erratic mobile network conditions.',
    ],
    category: 'AI & Machine Learning',
    status: 'active',
    technologies: [
      'React',
      'TypeScript',
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
    displayOrder: 2,
    evidenceSource: 'Verified GitHub repository (70+ source files, package.json dependencies, and hackathon documentation)',
    verificationStatus: 'verified',
    architectureDiagramType: 'hazard-detection',
  },
  {
    slug: 'stadium-x',
    name: 'StadiumX',
    shortDescription:
      'Interactive sports venue booking and seating management prototype built with React, Vite, Firebase, and Google GenAI.',
    detailedOverview:
      'An event ticketing and venue layout application allowing event organizers to configure seating tiers, manage admission zones, and provide attendees with an intuitive interactive seat selection and reservation experience.',
    problemStatement:
      'Complex stadium seating layouts create customer friction and high checkout abandonment rates when relying on static, generic reservation tables.',
    solution:
      'A componentized seating map interface with zone availability visualization, Firebase state persistence, and responsive booking flows.',
    architectureHighlights: [
      'React 19 & Vite frontend with Motion animations and Tailwind CSS layout',
      'Firebase backend integration for venue reservation state management',
      'Google GenAI SDK integration for attendee support and seating assistance',
      'REST API architectural patterns for ticket validation and reservation holds',
    ],
    engineeringDecisions: [
      'Engineered an SVG-based interactive seating zone coordinate matrix to maintain 60 FPS viewport navigation across complex arena layouts.',
      'Structured Firebase real-time listeners with optimistic UI locking to prevent double-booking collisions during seat reservation.',
      'Modularized seating tiers into lightweight vector nodes to avoid heavy canvas re-renders on mobile devices.',
    ],
    challenges: [
      'Rendering multi-tier venue seating maps responsively across mobile touch screens without pinch-to-zoom disorientation.',
      'Synchronizing concurrent hold states across multiple active booking sessions in real time.',
    ],
    category: 'Full-Stack Web',
    status: 'prototype',
    technologies: [
      'React',
      'TypeScript',
      'Vite',
      'Firebase',
      'Google Gemini AI',
      'Tailwind CSS',
      'REST API',
      'Motion',
    ],
    keyFeatures: [
      'Interactive venue seating zone visualization',
      'Firebase cloud database integration',
      'Responsive mobile ticket selection flow',
      'Automated seating tier pricing calculation',
    ],
    metrics: [
      { label: 'UI Architecture', value: 'SVG Coordinate Matrix' },
      { label: 'State Sync', value: 'Firebase Real-Time' },
    ],
    githubUrl: 'https://github.com/RANAPRINCE06/StadiumX',
    isFeatured: true,
    displayOrder: 3,
    evidenceSource: 'Verified GitHub repository (src/App.tsx, package.json)',
    verificationStatus: 'verified',
    architectureDiagramType: 'venue-grid',
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
    engineeringDecisions: [
      'Employed Sentence-BERT (all-MiniLM-L6-v2) to capture semantic contextual alignment rather than brittle lexical keyword frequency.',
      'Built modular spaCy entity extractors to isolate hard technical competencies from soft career prose.',
      'Cached common token vectors in SQLite to optimize repeated JD-to-resume comparisons.',
    ],
    challenges: [
      'Normalizing inconsistent multi-format resume documents (PDF, DOCX) into clean structural tokens for vectorization.',
      'Constraining memory footprint of transformer embeddings within serverless execution constraints.',
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
    displayOrder: 4,
    evidenceSource: 'Verified GitHub repository (models/resume_analyzer.py) and active Vercel production deployment (HTTP 200)',
    verificationStatus: 'verified',
    architectureDiagramType: 'nlp-embeddings',
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
    engineeringDecisions: [
      'Integrated Google Maps interactive cluster view with Firebase real-time listeners for field dispatch coordination.',
      'Implemented structured AI prompt chains for actionable emergency responder protocol recommendations.',
    ],
    challenges: [
      'Minimizing map re-render cycles during rapid consecutive marker position updates.',
      'Validating emergency dispatch coordinates against geo-fence boundary limits.',
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
    displayOrder: 5,
    evidenceSource: 'Verified GitHub repository (src/firebase.ts, package.json) and active Vercel deployment (HTTP 200)',
    verificationStatus: 'verified',
    architectureDiagramType: 'crisis-command',
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
    engineeringDecisions: [
      'Implemented 15+ REST endpoints with strict JWT middleware authentication and parameterized SQL queries to prevent injection.',
      'Layered Helmet security headers and bcrypt salt hashing to safeguard freight manifests and administrative roles.',
    ],
    challenges: [
      'Managing relational SQLite write locking under concurrent route update requests.',
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
    displayOrder: 6,
    evidenceSource: 'Verified GitHub repository (server.js, package.json dependencies, setup-db.js)',
    verificationStatus: 'verified',
    architectureDiagramType: 'logistics-dag',
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
    engineeringDecisions: [
      'Implemented Spring Cloud Gateway routing for centralized JWT authentication and service discovery via Eureka.',
      'Decoupled checkout transactions with asynchronous Kafka event streaming to guarantee inventory consistency.',
    ],
    challenges: [
      'Handling eventual consistency and compensating transactions across distributed order and payment databases.',
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
    displayOrder: 7,
    evidenceSource: 'Verified GitHub repository (docs/system-reanalysis.md and README attribution)',
    verificationStatus: 'verified',
    architectureDiagramType: 'microservices-mesh',
  },
];
