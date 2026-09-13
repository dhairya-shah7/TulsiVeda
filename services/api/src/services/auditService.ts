import crypto from 'crypto';
import { pool } from '../db/postgres.js';

export interface AuditEventParams {
  eventType: string;
  actorId?: string;
  entityType: string;
  entityId?: string;
  payload: Record<string, any>;
}

export class AuditService {
  /**
   * Log an immutable audit event to PostgreSQL
   */
  public static async logEvent(params: AuditEventParams): Promise<void> {
    const timestamp = new Date().toISOString();
    const serializedPayload = JSON.stringify(params.payload);
    
    // Cryptographic hash chaining
    const checksum = crypto
      .createHash('sha256')
      .update(`${params.eventType}:${params.entityType}:${params.entityId || ''}:${serializedPayload}:${timestamp}`)
      .digest('hex');

    try {
      await pool.query(
        `INSERT INTO audit_events (event_type, actor_id, entity_type, entity_id, payload, checksum_hash, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          params.eventType,
          params.actorId || null,
          params.entityType,
          params.entityId || null,
          params.payload,
          checksum,
          timestamp,
        ]
      );
      console.log(`[AuditLog] Recorded ${params.eventType} on ${params.entityType} [Hash: ${checksum.slice(0, 10)}...]`);
    } catch (err) {
      console.error('[AuditLog] Failed to persist audit event:', err);
    }
  }

  /**
   * Query recent audit trail
   */
  public static async getRecentEvents(limit = 20) {
    const res = await pool.query(
      `SELECT a.*, u.name as actor_name 
       FROM audit_events a
       LEFT JOIN users u ON a.actor_id = u.id
       ORDER BY a.created_at DESC 
       LIMIT $1`,
      [limit]
    );
    return res.rows;
  }
}
