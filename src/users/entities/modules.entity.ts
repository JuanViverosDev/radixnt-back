import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Roles } from './roles.entity';
import { CategoryModule } from './catModules.entity';

@Entity('modules')
export class Modules {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({name:"name"})
  moduleName: string;

  @Column({ name:"component" , nullable: true})
  moduleComponent: string;

  @Column({ name:"url" , nullable: true})
  moduleUrl: string;

  @Column({ name:"icon" , nullable: true})
  moduleIcon: string;

  @ManyToMany(()=> Roles, (roles)=> roles.roleModules)
  @JoinTable({name: 'modules_roles'})
  moduleRole: Roles[];

  @ManyToOne(()=>CategoryModule, (category)=> category.categoryModule)
  moduleCategory: CategoryModule

  @Column({name:'order', default: 1})
  moduleOrder: number;

  @Column({name:'state', default: true})
  moduleState: boolean;

  @Column({type:'json', nullable: true})
  permission: string;

  @Exclude()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
