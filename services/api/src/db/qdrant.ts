import { QdrantClient } from '@qdrant/js-client-rest';
import { config } from '../config/index.js';

export const qdrantClient = new QdrantClient({
  url: config.qdrant.url,
  checkCompatibility: false,
});

export async function checkQdrantConnection(): Promise<boolean> {
  try {
    const collections = await qdrantClient.getCollections();
    return Array.isArray(collections.collections);
  } catch (err) {
    console.error('[Qdrant] Health check failed:', err);
    return false;
  }
}

export async function initQdrantCollections(): Promise<void> {
  try {
    const existing = await qdrantClient.getCollections();
    const found = existing.collections.some((c) => c.name === config.qdrant.collection);
    if (!found) {
      console.log(`[Qdrant] Creating collection ${config.qdrant.collection}...`);
      await qdrantClient.createCollection(config.qdrant.collection, {
        vectors: {
          size: 512, // Standard CLIP embedding dimension
          distance: 'Cosine',
        },
      });
      console.log(`[Qdrant] Collection ${config.qdrant.collection} created.`);
    }
  } catch (err) {
    console.warn('[Qdrant] Collection initialization warning:', err);
  }
}
