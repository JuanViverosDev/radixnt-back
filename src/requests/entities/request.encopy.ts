import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Users } from '../../users/entities/users.entity';
import { ProcessState } from './processState.entity';

@Entity('request_header')
export class RequestHeader_old {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column({ name:'number_settled' })
  numberSettled: string;
  
  @Column({ name:'applicant_name' })
  applicantName: string;
  
  @Column({ name:'employee_full_name' })
  employeeFullName: string;
  
  @Column({ name:'employee_dependency' })
  employeeDependency: string;
  
  @Column({ name:'employee_position' })
  employeePosition: string;
  
  @Column({ name:'employee_email' })
  employeeEmail: string;
  
  @Column({ name:'employee_address' })
  employeeAddress: string;
  
  @Column()
  fileNumber: string;

  @Column()
  nameRequester: string;

  @Column()
  subject: string;

  @ManyToOne(()=>Users, (user)=>user.id)
  userReceive: Users;

  @Column({ type:'timestamptz' })
  expireDate: Date;

  @Column()
  attachments: string;

  @ManyToOne(()=>ProcessState, (state)=>state.id)
  state: ProcessState;

  @Exclude()
  @CreateDateColumn({ type:'timestamptz' })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({ type:'timestamptz' })
  updatedAt: Date;

}
