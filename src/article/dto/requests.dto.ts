import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InsertArticleBodyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Title',
    example: 'title',
    type: String,
  })
  public readonly title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Description',
    example: 'description',
    type: String,
  })
  public readonly description: string;
}

export class UpdateArticleBodyDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly title: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly description: string;
}
