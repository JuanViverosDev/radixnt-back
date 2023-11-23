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
import { AttachmentType } from './attachmentType.entity';
import { RequestHeader } from '../../requests/entities/request.entity';
  
  @Entity('attachment')
  export class Attachment {
    @PrimaryGeneratedColumn("uuid")
    id: string;
  
    @Column({name:"name"})
    fileName: string;
  
    @Column()
    base64: string;

    @ManyToOne(()=>AttachmentType, (attach)=> attach.id)
    attachType : AttachmentType;

    @Column({default: true})
    attachState: boolean;

    @Column({name: 'fileType'})
    fileType: string;

    @Exclude()
    @ManyToOne(()=>RequestHeader, (request) => request.attachments)
    requestHeader : RequestHeader;

    @Exclude()
    @CreateDateColumn({ type:'timestamptz' })
    createdAt: Date;
  
    @Exclude()
    @UpdateDateColumn({ type:'timestamptz' })
    updatedAt: Date;

    @Column({name: 'documentType', nullable: true})
    documentType?: string;

  }
  