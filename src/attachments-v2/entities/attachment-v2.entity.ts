import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn} from "typeorm";
import {RequestHeader} from "../../requests/entities/request.entity";

@Entity('attachments_v2')
export class AttachmentV2 {
  @PrimaryColumn({name: 's3_key'})
  s3Key: string;

  @Column()
  filename: string;

  @Column({name: 'file_type'})
  fileType: string;

  @ManyToOne(type => RequestHeader, request => request.attachmentsV2)
  @JoinColumn({name: 'request_id'})
  request?: RequestHeader | string;

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt: Date;
}