import { get } from 'env-var';

export class AppConfig {
  public static readonly PORT: number = get('APP_PORT')
    .required()
    .asPortNumber();

  public static readonly JWT_SECRET: string = get('JWT_SECRET')
    .required()
    .asString();

  public static readonly JWT_PUBLIC_KEY: string = get('JWT_PUBLIC_KEY')
    .required()
    .asString();

  public static readonly JWT_PRIVATE_KEY: string = get('JWT_PRIVATE_KEY')
    .required()
    .asString();

  public static readonly SWAGGER_PREFIX: string =
    get('SWAGGER_PREFIX').asString();
}
