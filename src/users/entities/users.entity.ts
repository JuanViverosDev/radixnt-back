import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Positions } from './positions.entity';
import { Roles } from './roles.entity';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({name:"name"})
  userName: string;

  @Column({name:"last_name"})
  userLastName: string;

  @Column({name:"email"})
  userEmail: string;

  @Column({name:"firebase_uuid"})
  fireBaseUUID: string;

  @ManyToOne(()=> Positions, (positions)=> positions.id)
  @JoinColumn({name: 'id_position'})
  userPosition: Positions;

  @ManyToOne(() => Roles, (role) => role.id)
  @JoinColumn({name: 'id_role'})
  userRole: Roles;

  @ManyToMany(() => Roles)
  @JoinTable({ name: 'users_roles' })
  roles: Roles[] | string[];

  @Column({name:'state', default: true})
  userState: boolean;

  @Exclude()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
  
  @Exclude()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
