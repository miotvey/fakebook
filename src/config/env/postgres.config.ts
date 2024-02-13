import { get } from 'env-var';

export class PostgresConfig {
  public static readonly DB_HOST: string = get('POSTGRES_HOST')
    .required()
    .asString();

  public static readonly DB_PORT: number = get('POSTGRES_PORT')
    .required()
    .asPortNumber();

  public static readonly DB_USERNAME: string = get('POSTGRES_USER')
    .required()
    .asString();

  public static readonly DB_PASSWORD: string = get('POSTGRES_PASSWORD')
    .required()
    .asString();

  public static readonly DB_NAME: string = get('POSTGRES_DB')
    .required()
    .asString();

  public static readonly DB_SCHEMA: string = get('POSTGRES_SCHEMA')
    .required()
    .asString();

  public static readonly DB_SSL: boolean = get('POSTGRES_SSL')
    .required()
    .asBool();

  public static readonly DB_LOG: boolean = get('POSTGRES_LOG')
    .required()
    .asBool();
}
