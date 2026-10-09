export const skillCategories = [
  {
    id: 'languages',
    title: 'Languages',
    icon: 'Code2',
    accentColor: '#00d4ff',
    skills: [
      { name: 'Java', level: 95, description: 'Strong OOPs adherence, enterprise patterns' },
      { name: 'JavaScript (ES6+)', level: 90, description: 'Modern syntax, async programming, DOM APIs' },
      { name: 'SQL', level: 85, description: 'Complex queries, optimization, indexing' },
      { name: 'C', level: 70, description: 'Systems-level thinking, memory management' },
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend Engineering',
    icon: 'Monitor',
    accentColor: '#0088ff',
    skills: [
      { name: 'React.js', level: 92, description: 'Hooks, Context, Performance optimization' },
      { name: 'Redux', level: 85, description: 'State management, middleware, RTK' },
      { name: 'Tailwind CSS', level: 90, description: 'Utility-first styling, custom config, dark mode' },
      { name: 'Framer Motion', level: 80, description: 'Page transitions, gesture animations' },
      { name: 'Figma', level: 75, description: 'UI design, component systems, prototyping' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend & Architecture',
    icon: 'Server',
    accentColor: '#aa00ff',
    skills: [
      { name: 'Spring Boot', level: 95, description: 'REST APIs, auto-config, actuator, testing' },
      { name: 'Hibernate / JPA', level: 88, description: 'ORM mapping, lazy loading, HQL' },
      { name: 'Microservices', level: 85, description: 'Service boundaries, inter-service comms' },
      { name: 'Apache Kafka', level: 82, description: 'Topics, partitions, consumer groups, streams' },
      { name: 'Spring Security', level: 88, description: 'JWT, OAuth2, role-based access' },
      { name: 'Distributed Systems', level: 78, description: 'CAP theorem, consensus, event sourcing' },
    ],
  },
  {
    id: 'database',
    title: 'Data Layer',
    icon: 'Database',
    accentColor: '#00ff88',
    skills: [
      { name: 'MySQL', level: 90, description: 'Schema design, transactions, replication' },
      { name: 'PostgreSQL', level: 88, description: 'Advanced queries, JSON support, extensions' },
      { name: 'pgVector', level: 75, description: 'Vector embeddings, similarity search, HNSW' },
    ],
  },
  {
    id: 'ai-cloud',
    title: 'AI & Cloud',
    icon: 'Brain',
    accentColor: '#ff8800',
    skills: [
      { name: 'Google Cloud Vertex AI', level: 78, description: 'Model deployment, embeddings API' },
      { name: 'Speech-to-Text', level: 80, description: 'Audio processing, transcription pipelines' },
      { name: 'Vector Embeddings', level: 75, description: 'Chunking, semantic search, RAG concepts' },
    ],
  },
  {
    id: 'devops-tools',
    title: 'Tools & DevOps',
    icon: 'Wrench',
    accentColor: '#ff0088',
    skills: [
      { name: 'Git / GitHub', level: 92, description: 'Branching strategies, CI hooks, PR reviews' },
      { name: 'Docker', level: 85, description: 'Containerization, compose, multi-stage builds' },
      { name: 'Vercel', level: 88, description: 'Serverless deploys, edge functions, previews' },
    ],
  },
];
