import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { appDataSourceOptions } from './data-source';
import { ArticleModule } from './article/article.module';
import { jwtTokenMiddleware } from './shared/jwt.middleware';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: undefined,
      useFactory: () => appDataSourceOptions,
      dataSourceFactory: async (options) => {
        if (!options) {
          throw new Error('TypeORM options are undefined.');
        }

        return new DataSource(options).initialize();
      },
    }),
    AuthModule,
    UserModule,
    ArticleModule,
  ],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer
      .apply(jwtTokenMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
