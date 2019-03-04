import { Entity, PrimaryGeneratedColumn, Column, Index, BaseEntity, BeforeInsert } from 'typeorm';
import bcrypt from 'bcryptjs';
import { ObjectType, Field, ID, Root } from 'type-graphql';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  fullName(@Root() parent: this): string {
    return `${parent.firstName} ${parent.lastName}`;
  }

  @Field()
  @Index({ unique: true })
  @Column()
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
