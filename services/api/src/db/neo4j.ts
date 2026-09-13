import neo4j, { Driver, Session } from 'neo4j-driver';
import { config } from '../config/index.js';

let driver: Driver | null = null;

export function getNeo4jDriver(): Driver {
  if (!driver) {
    driver = neo4j.driver(
      config.neo4j.uri,
      neo4j.auth.basic(config.neo4j.user, config.neo4j.password),
      {
        maxConnectionPoolSize: 50,
        connectionTimeout: 5000,
      }
    );
  }
  return driver;
}

export async function checkNeo4jConnection(): Promise<boolean> {
  try {
    const d = getNeo4jDriver();
    const serverInfo = await d.getServerInfo();
    return !!serverInfo.address;
  } catch (err) {
    console.error('[Neo4j] Health check failed:', err);
    return false;
  }
}

export async function runCypher<T = any>(query: string, params: Record<string, any> = {}): Promise<T[]> {
  const d = getNeo4jDriver();
  const session: Session = d.session();
  try {
    const result = await session.run(query, params);
    return result.records.map((rec) => rec.toObject() as T);
  } finally {
    await session.close();
  }
}
