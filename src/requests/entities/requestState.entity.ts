import { Roles } from '../../users/entities/roles.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable
} from 'typeorm';

@Entity('requestState')
export class RequestState {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({name: 'stateName'})
  stateName: string;

  @Column({name: 'stageName', nullable : true})
  stageName?: string; //TODO Hacer relación con el StageName, por ahora va en string para facilidad.

  @Column({name: 'faseName', nullable : true})
  faseName?: string; //TODO Hacer relación con un FaseName, por ahora va en string para facilidad.

  @Column({nullable: true})
  days?: number;

  @Column({nullable:true})
  isBusinessDays?: boolean;

  @Column({name: 'previous_days', nullable:true})
  previousDays?: number;

  @ManyToMany(()=> Roles, (roles)=> roles.id, {cascade: true})
  @JoinTable({name: 'requestState_roles'})
  alertRoles: Roles[];
}