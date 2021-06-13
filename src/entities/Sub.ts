import {
  Entity as TOEntity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import Entity from './entity';
import User from './User';
import Post from './Posts';
import { Expose } from 'class-transformer';

@TOEntity('subs')
export default class Sub extends Entity {
  constructor(sub: Partial<Sub>) {
    super();
    Object.assign(this, sub);
  }

  @Column({ unique: true })
  name: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrn: string; //name stored, URL created at runtime

  @Column({ nullable: true })
  bannerUrn: string;

  @Column()
  username: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @OneToMany(() => Post, (post) => post.sub)
  posts: Post[];

  @Expose()
  get imageUrl(): string {
    return this.imageUrn
      ? `${process.env.APP_URL}/images/${this.imageUrn}`
      : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=robohash&f=y';
  }

  @Expose()
  get bannerUrl(): string | undefined {
    return this.bannerUrn
      ? `${process.env.APP_URL}/images/${this.bannerUrn}`
      : undefined;
  }
}
