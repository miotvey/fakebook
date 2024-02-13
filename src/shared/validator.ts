import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  HttpStatus,
  HttpException,
  CallHandler,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { isEmpty, flattenDeep } from 'lodash';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ValidateResponse implements NestInterceptor {
  public static schema: any;

  public get schema() {
    return (this.constructor as any).schema;
  }

  public intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    return next.handle().pipe(
      map(async (data) => {
        let validatorObject;

        try {
          validatorObject = plainToInstance(this.schema, data);
        } catch (error) {
          throw new HttpException(
            { error, message: 'Validation Response error' },
            HttpStatus.BAD_REQUEST,
          );
        }

        const errors = await validate(validatorObject, { whitelist: false });

        if (errors.length > 0) {
          const mapError = (item) =>
            isEmpty(item.children) ? item : item.children.map(mapError);
          const nestedErrors = flattenDeep(errors.map(mapError));

          if (data?.statusCode !== 204) {
            console.error(
              `Validation response for ${this.schema.name} errors: `,
              JSON.stringify(nestedErrors, null, 2),
            );
          }
        }

        return validatorObject;
      }),
    );
  }
}
