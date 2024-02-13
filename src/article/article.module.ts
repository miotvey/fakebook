import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { ArticleEntity } from './entities/article.entity';
import { ArticleMapper } from './article.mapper';
import { ArticleRepository } from './article.repository';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity]), RedisModule],
  providers: [ArticleMapper, ArticleRepository, ArticleService],
  controllers: [ArticleController],
})
export class ArticleModule {}
