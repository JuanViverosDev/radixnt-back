import {
  Column,
  Entity,
  PrimaryGeneratedColumn,

} from 'typeorm';

@Entity('requestStage')
export class RequestStage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'stageName' })
  stageName: string;
}
