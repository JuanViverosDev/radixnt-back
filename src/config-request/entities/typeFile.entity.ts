import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { Exclude } from 'class-transformer';
  
  @Entity('type_file')
  export class TypeFile {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column({name:"name"})
    typeFileName: string;
  
    @Column({name:'state', default: true})
    typeFileState: boolean;
  
    @Exclude()
    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;
  
    @Exclude()
    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
  }
  