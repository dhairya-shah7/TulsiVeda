import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { checkPostgresConnection } from './db/postgres.js';
import { checkNeo4jConnection } from './db/neo4j.js';
import { checkQdrantConnection, initQdrantCollections } from './db/qdrant.js';
import { dashboardRouter } from './routes/dashboardRoutes.js';
import { remedyRouter } from './routes/remedyRoutes.js';
import { plantRouter } from './routes/plantRoutes.js';
import { prescriptionRouter } from './routes/prescriptionRoutes.js';
import { safetyRouter } from './routes/safetyRoutes.js';
import { adminRouter } from './routes/adminRoutes.js';
import voiceRouter from './routes/voiceRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Mount Routes
app.use('/api/dashboard', dashboardRouter);
app.use('/api/remedies', remedyRouter);
app.use('/api/plants', plantRouter);
app.use('/api/prescriptions', prescriptionRouter);
app.use('/api/safety', safetyRouter);
app.use('/api/admin', adminRouter);
app.use('/api/voice', voiceRouter);

// Root health
app.get('/health', async (req, res) => {
  const [pg, neo4j, qdrant] = await Promise.all([
    checkPostgresConnection(),
    checkNeo4jConnection(),
    checkQdrantConnection(),
  ]);

  res.json({
    status: 'online',
    service: 'TulsiVeda AI Backend API',
    databases: {
      postgres: pg ? 'healthy' : 'disconnected',
      neo4j: neo4j ? 'healthy' : 'disconnected',
      qdrant: qdrant ? 'healthy' : 'disconnected',
    },
    ocr: 'Dots.OCR + Tesseract Fallback Active',
    asr: 'IndicWhisper Ingestion Active',
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Unhandled Error]:', err);
  res.status(err.status || 500).json({
    error: err.name || 'InternalServerError',
    message: err.message || 'An unexpected error occurred',
  });
});

// Start Server
const PORT = config.port;
app.listen(PORT, async () => {
  console.log(`=======================================================`);
  console.log(`🌿 TulsiVeda AI Backend Server running on port ${PORT}`);
  console.log(`=======================================================`);
  
  // Verify database connectivity
  const [pgOk, neo4jOk, qdrantOk] = await Promise.all([
    checkPostgresConnection(),
    checkNeo4jConnection(),
    checkQdrantConnection(),
  ]);

  console.log(`[Status] PostgreSQL: ${pgOk ? '✅ CONNECTED' : '❌ OFFLINE'}`);
  console.log(`[Status] Neo4j Graph: ${neo4jOk ? '✅ CONNECTED' : '❌ OFFLINE'}`);
  console.log(`[Status] Qdrant Vector: ${qdrantOk ? '✅ CONNECTED' : '❌ OFFLINE'}`);

  if (qdrantOk) {
    await initQdrantCollections();
  }
});
