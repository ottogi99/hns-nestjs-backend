import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('User')
export default class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 60 })
  email: string;

  @Column({ length: 30 })
  username: string;

  @Column({ length: 30 })
  password: string;

  @Column({length: 60})
  signupVerifyToken: string;
}