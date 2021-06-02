import { IsEmail, Length, MinLength } from 'class-validator';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';

import bcrypt from 'bcrypt';
import { classToPlain, Exclude } from 'class-transformer';

@Entity('users')
export class User extends BaseEntity {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @Exclude() //id number is hidden from res
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @IsEmail()
  @Length(3, 254, { message: 'Please provide a valid email address.' })
  @Column({ unique: true })
  email: string;

  @Index()
  @Length(3, 33, {
    message: 'Username must be between 3 and 33 characters long.',
  })
  @Column({ unique: true })
  username: string;

  @Exclude() // hashed pw is hidden from res
  @Column()
  @MinLength(6, { message: 'Password must be more 6 characters' })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
  toJSON() {
    return classToPlain(this);
    //
  }
}
