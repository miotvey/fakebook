import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisConfig } from '../config/env/redis.config';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redis: Redis;

  onModuleInit() {
    this.redis = new Redis({
      host: RedisConfig.REDIS_HOST,
      port: RedisConfig.REDIS_PORT,
    });
  }

  onModuleDestroy() {
    this.redis.quit();
  }

  async setValue(key: string, value: string): Promise<void> {
    await this.redis.set(key, value);
  }

  async getValue(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async keyExists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key);
    return result === 1;
  }

  async deleteKey(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
