import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Users } from '../../users/entities/users.entity';
import { ProcessState } from './processState.entity';
import { TypeRequest } from './typeRequest.entity';
import { RequestDisciplined } from './requestDisciplined.entity';
import { Attachment } from '../../attachments/entities/attachment.entity';
import { RequestState } from './requestState.entity';
import { RequestObservations } from './requestObservations.entity';
import { RequestStage } from './requestStage.entity';
import { AttachmentV2 } from '../../attachments-v2/entities/attachment-v2.entity';

@Entity('request_header')
export class RequestHeader {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  consecutivo: number;

  @Column({ nullable: true })
  radicado: string;
  @Column({ nullable: true })
  expediente: string;
  @Column({ nullable: true })
  nombreSolicitante: string;
  @Column({ name: 'calidad_solicitante', nullable: true })
  calidadSolicitante: string;
  @Column({ nullable: true })
  etapa: string;
  @Column({ nullable: true })
  documentalTypeSelected: string;
  @Column({ nullable: true })
  comunicationChannelSelected: string;
  @Column({ nullable: true })
  direccionCorrespondencia: string;
  @Column({ nullable: true })
  correo: string;
  @Column({ nullable: true })
  telefono: string;
  @Column({ nullable: true })
  nombreFuncionario: string;
  @Column({ nullable: true })
  dependecia: string;
  @Column({ nullable: true })
  positionSelected: string;
  @Column({ nullable: true })
  systemState: boolean;
  @ManyToOne(() => Users, (user) => user.id, { cascade: true })
  agentSelected: Users;
  @ManyToOne(() => TypeRequest, (type) => type.id)
  applicantTypeRequest: TypeRequest;

  @OneToMany(
    () => RequestDisciplined,
    (disciplined) => disciplined.requestHeader,
    { cascade: true },
  )
  disciplined: RequestDisciplined[];

  @Column({ nullable: true })
  subject: string;
  @Column({ nullable: true })
  authorIdentified: string;
  @Column({ nullable: true })
  indagacionPrevia: string;
  @Column({ nullable: true })
  disciplanaryInvestigation: string;
  @Column({ nullable: true })
  recursoApelacion: string;
  @Column({ nullable: true })
  procedeRecursoApelacion: string;
  @Column({ nullable: true })
  decisionEvaluacion: string;
  @Column({ nullable: true })
  continueInvestigation: string;
  @Column({ nullable: true })
  decisionSegundaInstancia: string;
  @Column({ nullable: true })
  decisionSegundaInstanciaOtros: string;
  @Column({ nullable: true })
  confesar: string;
  @Column({ nullable: true })
  tieneApoderado: string;
  @Column({ nullable: true })
  procedeConfesion: string;
  @Column({ nullable: true })
  medioJuzgamiento: string;
  @Column({ nullable: true })
  aceptaCargos: string;
  @Column({ nullable: true })
  apruebaPruebasCompletas: string;
  @Column({ nullable: true })
  apelaFallo: string;
  @Column({ nullable: true })
  presentaRecursoApelacionAutoDecisionPruebas: string;
  @Column({ nullable: true })
  concedeRecurso: string;
  @Column({ nullable: true })
  hayNulidad: string;
  @Column({ nullable: true })
  archiveDisciplanaryInvestigation: string;
  @Column({ nullable: true })
  recursoApelacionJuzgamiento: string;
  @Column({ nullable: true })
  procedeRecursoApelacionJuzgamiento: string;
  @Column({ nullable: true })
  continueInvestigationJuzgamiento: string;

  @Column({ nullable: true, name: 'number_settled' })
  numberSettled: string;
  @Column({ nullable: true, name: 'applicant_name' })
  applicantName: string;
  @Column({ nullable: true, name: 'employee_full_name' })
  employeeFullName: string;

  @Column({ nullable: true, name: 'employee_dependency' })
  employeeDependency: string;

  @Column({ nullable: true, name: 'employee_position' })
  employeePosition: string;

  @Column({ nullable: true, name: 'employee_email' })
  employeeEmail: string;

  @Column({ nullable: true, name: 'employee_address' })
  employeeAddress: string;

  @Column({ nullable: true })
  fileNumber: string;

  @Column({ nullable: true })
  nameRequester: string;

  @ManyToOne(() => Users, (user) => user.id)
  userReceive: Users;

  @Column({ nullable: true, type: 'timestamptz' })
  expireDate: Date;

  @Column({ name: 's3_folder', nullable: true })
  s3Folder: string;

  @OneToMany(() => Attachment, (attachment) => attachment.requestHeader)
  attachments: Attachment[];

  @OneToMany(() => AttachmentV2, (attachment) => attachment.request)
  attachmentsV2: AttachmentV2[];

  @ManyToOne(() => ProcessState, (state) => state.id)
  state: ProcessState;

  // @Exclude()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  // @Exclude()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @ManyToOne(() => RequestState, (requestState) => requestState.id)
  requestState: RequestState;

  @OneToMany(
    () => RequestObservations,
    (requestObservation) => requestObservation.requestId,
  )
  requestObservations: RequestObservations[];

  @ManyToMany(() => RequestStage, (requestStage) => requestStage.id, {
    cascade: true,
  })
  @JoinTable({ name: 'request_requestStages' })
  requestStages: RequestStage[];

  @Column({ name: 'compliance_facts', nullable: true })
  complianceFacts: Date;

  @Column('text', { name: 'proceedings_numbers', nullable: true, array: true })
  proceedingsNumbers: string[];

  @Column({ nullable: true, default: true })
  enabled: boolean = true;

  @Column({ nullable: true })
  cedulaSolicitante: string;
}
