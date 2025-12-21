import { Inject, Injectable, Scope } from '@nestjs/common';
import { Pool, PoolClient, QueryConfig, QueryResultRow } from 'pg';
import { CustomLogger } from '_@common/logger/custom-logger.service';
import {
  POSTGRES_READ_CONNECTION,
  POSTGRES_WRITE_CONNECTION,
} from './constants/database.constants';

@Injectable({ scope: Scope.DEFAULT })
export class DatabaseService {
  private readonly logger = new CustomLogger(DatabaseService.name);

  constructor(
    @Inject(POSTGRES_READ_CONNECTION.PROVIDER) private readonly readPool: Pool,
    @Inject(POSTGRES_WRITE_CONNECTION.PROVIDER)
    private readonly writePool: Pool,
  ) {}

  async select<T extends QueryResultRow = any>(
    query: string | QueryConfig,
    values?: any[],
  ): Promise<T[]> {
    this.logger.debug(`SELECT QUERY: ${this.formatQuery(query)}`);
    const result = await this.readPool.query<T>(query, values);
    return result.rows;
  }

  async insert<T extends QueryResultRow = any>(
    query: string | QueryConfig,
    values?: any[],
  ): Promise<T[]> {
    this.logger.debug(`INSERT QUERY: ${this.formatQuery(query)}`);
    const result = await this.writePool.query<T>(query, values);
    return result.rows;
  }

  async update<T extends QueryResultRow = any>(
    query: string | QueryConfig,
    values?: any[],
  ): Promise<T[]> {
    this.logger.debug(`UPDATE QUERY: ${this.formatQuery(query)}`);
    const result = await this.writePool.query<T>(query, values);
    return result.rows;
  }

  async delete<T extends QueryResultRow = any>(
    query: string | QueryConfig,
    values?: any[],
  ): Promise<T[]> {
    this.logger.debug(`DELETE QUERY: ${this.formatQuery(query)}`);
    const result = await this.writePool.query<T>(query, values);
    return result.rows;
  }

  async query<T extends QueryResultRow = any>(
    query: string | QueryConfig,
    values?: any[],
    useWrite = false,
  ): Promise<T[]> {
    this.logger.debug(
      `RAW QUERY: ${this.formatQuery(query)} | useWrite: ${useWrite}`,
    );
    const result = await (useWrite ? this.writePool : this.readPool).query<T>(
      query,
      values,
    );
    return result.rows;
  }

  async transaction<T = any>(
    callback: (client: PoolClient) => Promise<T>,
  ): Promise<T> {
    const client = await this.writePool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      const error = err instanceof Error ? err : new Error(String(err));
      this.logger.error(
        'Transaction failed and rolled back.',
        error.stack || error.message,
      );
      throw err;
    } finally {
      client.release();
    }
  }

  private formatQuery(query: string | QueryConfig): string {
    return typeof query === 'string' ? query : query.text;
  }
}
