import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('articles')
export class ArticleEntity {
  @PrimaryColumn()
  uuid: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  author: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
