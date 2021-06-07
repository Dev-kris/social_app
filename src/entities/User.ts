import { IsEmail, Length, MinLength } from 'class-validator';

import {
  Entity as TOEntity,
  Column,
  Index,
  BeforeInsert,
  OneToMany,
} from 'typeorm';

import bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';

import Entity from './Entity';
import { define } from 'mime';
import Post from './Posts';

@TOEntity('users')
export default class User extends Entity {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  //@Index()
  @IsEmail()
  @Length(3, 254, { message: 'Please provide a valid email address.' })
  @Column({ unique: true })
  email: string;

  //@Index()
  @Length(3, 33, {
    message: 'Username must be between 3 and 33 characters long.',
  })
  @Column({ unique: true })
  username: string;

  @Exclude() // hashed pw is hidden from res
  @Column()
  @MinLength(6, { message: 'Password must be more 6 characters' })
  password: string;

  @OneToMany(() => Post, (post) => post.user) //inverse relation
  posts: Post[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
