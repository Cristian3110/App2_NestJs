//relation with typeORM and how will go our tableDB

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Post } from 'src/posts/posts.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userName: string;

  @Column()
  password: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ nullable: true })
  authStrategy: string;

  //Relation One to One of tables
  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;

  //rerlacion de uno a muchos
  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];
}
