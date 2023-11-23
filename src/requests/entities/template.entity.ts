import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  PrimaryColumn

} from 'typeorm';
import { RequestStage } from './requestStage.entity';

@Entity('template')
export class Template {
  // @PrimaryGeneratedColumn()
  @PrimaryColumn()
  id: number;

  @Column({ name: 'templateName' })
  templateName: string;

  @Column({ name: 'templateContent' })
  templateContent: string;

  @ManyToOne(()=>RequestStage, (requestStage)=>requestStage.id)
  @JoinColumn({name: 'requestStageId'})
  requestStage: RequestStage | number;

  @Column({name: 'order', nullable: true})
  order?: number;

  @Column({nullable: true})
  consecutive?: number;

  @Column({nullable: true})
  prefix?: string;

  @Column({name: 'is_vario', nullable: true})
  isVario?: boolean;

  @Column({name: 'document_type', nullable: true})
  documentType: string;

  @Column({name: 'se_notifica_quejoso', nullable: true})
  seNotificaQuejoso: boolean;

  @Column({name: 'se_notifica_disciplinado', nullable: true})
  seNotificaDisciplinado: boolean;

  @Column({name: 'se_comunica_quejoso', nullable: true})
  seComunicaQuejoso: boolean;

  @Column({name: 'se_comunica_disciplinado', nullable: true})
  seComunicaDisciplinado: boolean;

  @Column({name: 'fecha_notificacion_quejoso', nullable: true})
  fechaNotificacionQuejoso: Date;

  @Column({name: 'fecha_notificacion_disciplinado', nullable: true})
  fechaNotificacionDisciplinado: Date;

  @Column({name: 'fecha_comunicacion_quejoso', nullable: true})
  fechaComunicacionQuejoso: Date;

  @Column({name: 'fecha_comunicacion_disciplinado', nullable: true})
  fechaComunicacionDisciplinado: Date;

  @Column({ name: 'se_notifica_apoderado', nullable: true })
  seComunicaApoderado: boolean;

  @Column({ name: 'se_comunica_apoderado', nullable: true })
  seNotificaApoderado: boolean;

  @Column({ name: 'fecha_notificacion_apoderado', nullable: true })
  fechaNotificacionApoderado: Date;

  @Column({ name: 'fecha_comunicacion_apoderado', nullable: true })
  fechaComunicacionApoderado: Date;
}
