import { Field, Float, ID, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tag } from './Tag';

@ObjectType()
@Entity()
export class Story extends BaseEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Index()
  @Column('character varying')
  title: string;

  @Field()
  @Column('character varying')
  link: string;

  @Field()
  @Index()
  @Column('character varying')
  author: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  description?: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  introduction?: string;

  @Field({ complexity: 6 })
  @Column('text')
  text: string;

  @Field()
  @Index()
  @Column('date', { default: new Date() })
  date: Date;

  @Field(type => Float)
  @Index()
  @Column('real', { default: 0 })
  rating: number;

  @Field(type => Int)
  @Index()
  @Column('int', { default: 0 })
  votes: number;

  @Field(type => Int)
  @Index()
  @Column('int', { default: 0 })
  views: number;

  @Field(type => Int)
  @Index()
  @Column('int', { default: 0 })
  length: number;

  @Field({ nullable: true })
  @Index()
  @Column('character varying', { nullable: true })
  seriesLink?: string;

  @Field(type => [Tag])
  @ManyToMany(type => Tag, tag => tag.stories)
  @JoinTable()
  tags: Tag[];
}
