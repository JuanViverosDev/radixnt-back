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
  
  @Entity('process_state')
  export class ProcessState {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column({name:"name"})
    processStateName: string;
  
    @Column({name:'state', default: true})
    processStateState: boolean;

    @Column({name:'is_initial', nullable: true})
    isInitialState: boolean;
  
    @Exclude()
    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;
  
    @Exclude()
    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
  }
  