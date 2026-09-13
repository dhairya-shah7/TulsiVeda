import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  env: process.env.NODE_ENV || 'development',
  
  postgres: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    user: process.env.POSTGRES_USER || 'tulsiveda',
    password: process.env.POSTGRES_PASSWORD || 'tulsiveda_secure_password',
    database: process.env.POSTGRES_DB || 'tulsiveda_db',
  },

  neo4j: {
    uri: process.env.NEO4J_URI || 'bolt://localhost:7687',
    user: process.env.NEO4J_USER || 'neo4j',
    password: process.env.NEO4J_PASSWORD || 'tulsiveda_graph_password',
  },

  qdrant: {
    url: process.env.QDRANT_URL || 'http://localhost:6333',
    collection: 'botanical_reference',
  },

  dotsOcr: {
    url: process.env.DOTS_OCR_URL || 'http://localhost:8001/ocr',
    timeoutMs: 4000,
  },

  jwtSecret: process.env.JWT_SECRET || 'tulsiveda_production_secret_key_2026',
};
