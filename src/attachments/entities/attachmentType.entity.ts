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
  
  @Entity('attachment_type')
  export class AttachmentType {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column({name:"name"})
    nameAttachmentType: string;

    @Column({name:"state", default: true})
    stateAttachmentType: boolean;
    
    @Exclude()
    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;
  
    @Exclude()
    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
  }
  