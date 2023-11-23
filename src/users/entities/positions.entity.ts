import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('positions')
export class Positions {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({name:"name"})
  positionName: string;

  @Column({name:'state', default: true})
  positionState: boolean;

  @Exclude()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
