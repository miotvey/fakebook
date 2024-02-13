import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ValidateResponse } from '../../shared/validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AuthorizationResponse {
  @Expose()
  @IsString()
  @ApiProperty({
    description: 'User id',
    example: 'caae9c50-c958-11ee-bc6b-6d4e41eeb440',
  })
  public readonly uuid: string;

  @Expose()
  @IsString()
  @ApiProperty({
    description: 'User auth token',
    example:
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMDljYjczMDAtY2ExYi0xMWVlLWJkOWYtMTNiMTVjNTA0MTk3IiwibG9naW4iOiJBcnR1ciIsImNyZWF0ZWRBdCI6MTcwNzc5Mjc5NzI1MCwiaWF0IjoxNzA3NzkyNzk3LCJleHAiOjE3MTAzODQ3OTd9.M69jdq2pUNZIJYFzavpLsViuP7oU4OLc7Y0CZ49qz-skpRVD2PR7Ck804liXJElSgJOiDTliI4SPHGLya2DugxI78b_uJYxbnl6lPgziTlhLdOQcE2N8Rj8VZvIxpX5h3NLL_UN0qI9ZkQE9svpE3CwEGakrpGNzYyMCgyG1HLa0WSDdJHtj6sl0bug2sTguuHo0NP5ifPOwM8t2Ka8OUx08cum3iOhh9wJx0Rro7X2JQJmKv4SH1f3NjLn9j1n4GDzzicy5NLlHurb6spW3Sm3b1_Clt-amx2ucfLbHcrcPIdrlRdf0s9N4L8KWhFNPtLjWSu8Hozp3nkfV6tbinA',
  })
  public readonly authToken: string;
}

export class ValidateAuthorizationResponse extends ValidateResponse {
  public static schema = AuthorizationResponse;
}
