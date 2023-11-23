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
  
  @Entity('type_communication')
  export class TypeCommunication {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column({name:"name"})
    communicationName: string;
  
    @Column({name:'state', default: true})
    communicationState: boolean;
  
    @Exclude()
    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;
  
    @Exclude()
    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
  }
  