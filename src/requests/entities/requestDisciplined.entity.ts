import {
  Column,
  CreateDateColumn,
  Entity, JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
  import { Exclude } from 'class-transformer';
import { RequestHeader } from './request.entity';
import { Lawyers } from '../../config-request/entities/lawyers.entity';
  
  @Entity('request_disciplined')
  export class RequestDisciplined {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({name:"identificacion"})
    identificacion:string;
  
    @Column({name:"name", nullable: true})
    name: string;

    @Column({name: 'primer_apellido', nullable:true})
    primerApellido: string;

    @Column({name: 'segundo_apellido', nullable:true})
    segundoApellido: string;

    @Column({name:"email"})
    email: string;
  
    @Column({name:'dependencia'})
    dependencia: string;

    @Column({name:'cargo'})
    cargo: string;

    @Column({name:'isDisciplined'})
    isDisciplined: boolean;

    @ManyToOne(()=>RequestHeader, (req)=>req.disciplined)
    @JoinColumn({name: 'requestHeaderId'})
    requestHeader: RequestHeader | string;

    @Column({name: 'fecha_ingreso', nullable: true})
    fechaIngreso: Date;

    @Column({name: 'tipo_vinculacion', nullable: true})
    tipoVinculacion: string;

    @Column({name: 'tipo_contrato', nullable: true})
    tipoContrato: string;

    @Column({name: 'direccion_residencia', nullable: true})
    direccionResidencia: string;

    @Column({name: 'ciudad_residencia', nullable: true})
    ciudadResidencia: string;

    @Column({name: 'nombre_dpto_residencia', nullable: true})
    nombreDptoResidencia: string;

    @Column({nullable: true})
    telefono: string;

    @Column({name: 'medio_a_comunicar',nullable: true})
    medioAComunicar: string;

    @Column({name: 'numero_registro', nullable: true})
    numeroRegistro: string;

    @Exclude()
    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;
  
    @Exclude()
    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;

    @ManyToOne(() => Lawyers)
    lawyer: Lawyers | string;
  }
  