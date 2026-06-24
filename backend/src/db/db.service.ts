import { Injectable, OnModuleInit } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

@Injectable()
export class DbService implements OnModuleInit {
  public db: ReturnType<typeof drizzle<typeof schema>>;

  onModuleInit() {
    // In a real CF Worker environment, this would be injected via binding.
    // For local dev / HTTP connection, we use libsql client.
    const client = createClient({
      url: process.env.DATABASE_URL || 'file:local.db',
      authToken: process.env.DATABASE_AUTH_TOKEN,
    });
    
    this.db = drizzle(client, { schema });
  }
}
