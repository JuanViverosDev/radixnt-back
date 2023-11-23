import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';

import { RequestHeader } from './request.entity';
import { RequestStage } from './requestStage.entity';

@Entity('documents')
export class Documents {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => RequestHeader, (request) => request.id)
  @JoinColumn({ name: 'id_request' })
  requestId: RequestHeader | string;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'state' })
  state: string;

  @Column({ name: 'content' })
  content: string;

  @ManyToOne(() => RequestStage, (stage) => stage.id)
  @JoinColumn({ name: 'requestStageId' })
  stage: RequestStage | number;

  @Column({ name: 'order', nullable: true })
  order?: number;

  @Column({ nullable: true })
  consecutive?: number;

  @Column({ nullable: true })
  prefix?: string;

  @Column({ name: 'document_type', nullable: true })
  documentType: string;

  @Column({ name: 'se_notifica_quejoso', nullable: true })
  seNotificaQuejoso: boolean;

  @Column({ name: 'se_notifica_disciplinado', nullable: true })
  seNotificaDisciplinado: boolean;

  @Column({ name: 'se_comunica_quejoso', nullable: true })
  seComunicaQuejoso: boolean;

  @Column({ name: 'se_comunica_disciplinado', nullable: true })
  seComunicaDisciplinado: boolean;

  @Column({ name: 'fecha_notificacion_quejoso', nullable: true })
  fechaNotificacionQuejoso: Date;

  @Column({ name: 'fecha_notificacion_disciplinado', nullable: true })
  fechaNotificacionDisciplinado: Date;

  @Column({ name: 'fecha_comunicacion_quejoso', nullable: true })
  fechaComunicacionQuejoso: Date;

  @Column({ name: 'fecha_comunicacion_disciplinado', nullable: true })
  fechaComunicacionDisciplinado: Date;

  @Column({ name: 'fecha_comunicacion_fisica_disciplinado', nullable: true })
  fechaComunicacionFisicaDisciplinado: Date;

  @Column({ name: 'fecha_notificacion_fisica_disciplinado', nullable: true })
  fechaNotificacionFisicaDisciplinado: Date;

  @Column({ name: 'se_notifica_apoderado', nullable: true })
  seComunicaApoderado: boolean;

  @Column({ name: 'se_comunica_apoderado', nullable: true })
  seNotificaApoderado: boolean;

  @Column({ name: 'fecha_notificacion_apoderado', nullable: true })
  fechaNotificacionApoderado: Date;

  @Column({ name: 'fecha_comunicacion_apoderado', nullable: true })
  fechaComunicacionApoderado: Date;

  @Column({
    name: 'communications_and_notifications_data',
    type: 'jsonb',
    nullable: true,
  })
  communicationsAndNotificationsData: any;
}
