import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Modules } from './modules.entity';

@Entity('roles')
export class Roles {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({name:"name"})
  roleName: string;

  @Column({name:'is_request_manager', default: false})
  requestManager: boolean;

  @ManyToMany(()=> Modules, (module)=> module.moduleRole)
  @JoinTable({name: 'modules_roles'})
  roleModules: Modules[];

  @Column({name:'state', default: true})
  roleState: boolean;

  @Exclude()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
