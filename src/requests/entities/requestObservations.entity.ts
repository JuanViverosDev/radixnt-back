import {
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn
} from 'typeorm';

import { RequestHeader } from './request.entity';
import { Users } from '../../users/entities/users.entity';

@Entity('requestObservations')
export class RequestObservations {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => RequestHeader, request => request.id)
  @JoinColumn({name: 'id_request'})
  requestId: RequestHeader | string;

  @Column({name: 'content'})
  content: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ManyToOne(()=>Users, (user)=>user.id)
  userCreated: Users | string;

  @Column({name: 'observationType'})
  observationType: string; //Could be System or User
}