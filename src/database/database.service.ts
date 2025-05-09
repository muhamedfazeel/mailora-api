import { Inject, Injectable, Scope } from '@nestjs/common';
import { Pool, PoolClient, QueryConfig } from 'pg';
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

  async select<T = any>(
    query: string | QueryConfig,
    values?: any[],
  ): Promise<T[]> {
    this.logger.debug(`SELECT QUERY: ${this.formatQuery(query, values)}`);
    const result = await this.readPool.query<T>(query as any, values);
    return result.rows;
  }

  async insert<T = any>(
    query: string | QueryConfig,
    values?: any[],
  ): Promise<T[]> {
    this.logger.debug(`INSERT QUERY: ${this.formatQuery(query, values)}`);
    const result = await this.writePool.query<T>(query as any, values);
    return result.rows;
  }

  async update<T = any>(
    query: string | QueryConfig,
    values?: any[],
  ): Promise<T[]> {
    this.logger.debug(`UPDATE QUERY: ${this.formatQuery(query, values)}`);
    const result = await this.writePool.query<T>(query as any, values);
    return result.rows;
  }

  async delete<T = any>(
    query: string | QueryConfig,
    values?: any[],
  ): Promise<T[]> {
    this.logger.debug(`DELETE QUERY: ${this.formatQuery(query, values)}`);
    const result = await this.writePool.query<T>(query as any, values);
    return result.rows;
  }

  async query<T = any>(
    query: string | QueryConfig,
    values?: any[],
    useWrite = false,
  ): Promise<T[]> {
    this.logger.debug(
      `RAW QUERY: ${this.formatQuery(query, values)} | useWrite: ${useWrite}`,
    );
    const result = await (useWrite ? this.writePool : this.readPool).query<T>(
      query as any,
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
      this.logger.error(
        'Transaction failed and rolled back.',
        err.stack || err.message,
      );
      throw err;
    } finally {
      client.release();
    }
  }

  private formatQuery(query: string | QueryConfig, values?: any[]): string {
    return typeof query === 'string' ? query : query.text;
  }
}
