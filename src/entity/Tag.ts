import { Field, ID, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, Index, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Story } from './Story';

@ObjectType()
@Entity()
export class Tag extends BaseEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Index()
  @Column('character varying')
  name: string;

  @Field(type => Int)
  @Column('int', { default: 0 })
  count: number;

  @Field(type => [Story], { nullable: true })
  @ManyToMany(type => Story, story => story.tags)
  stories: Story[];
}
