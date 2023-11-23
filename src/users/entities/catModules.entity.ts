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
import { Modules } from './modules.entity';

@Entity('category_module')
export class CategoryModule {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({name:"name" , unique: true})
  categoryName: string;


  @OneToMany(()=> Modules, (module)=> module.moduleCategory)
  categoryModule: Modules[];

  @Column({name:'order', default: 1})
  categoryOrder: number;

  @Column({name:'state', default: true})
  categoryState: boolean;

  @Exclude()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
