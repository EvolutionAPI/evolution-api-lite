import { Chatwoot, configService } from '@config/env.config';
import { Logger } from '@config/logger.config';
import postgresql from 'pg';

const { Pool } = postgresql;

class Postgres {
  private logger = new Logger('Postgres');
  private pool;
  private connected = false;

  getConnection(connectionString: string) {
    if (this.connected) {
      return this.pool;
    } else {
      this.pool = new Pool({
        connectionString,
        ssl: {
          rejectUnauthorized: false,
        },
      });

      this.pool.on('error', () => {
        this.logger.error('postgres disconnected');
        this.connected = false;
      });

      try {
        this.connected = true;
      } catch (e) {
        this.connected = false;
        this.logger.error('postgres connect exception caught: ' + e);
        return null;
      }

      return this.pool;
    }
  }

  getChatwootConnection() {
    const uri = configService.get<Chatwoot>('CHATWOOT').IMPORT.DATABASE.CONNECTION.URI;

    return this.getConnection(uri);
  }
}

export const postgresClient = new Postgres();
