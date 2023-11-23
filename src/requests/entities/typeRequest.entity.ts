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
  
  @Entity('type_request')
  export class TypeRequest {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column({name:"name"})
    typeReqName: string;
  
    @Column({name:'state', default: true})
    typeReqState: boolean;
  
    @Exclude()
    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;
  
    @Exclude()
    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
  }
  