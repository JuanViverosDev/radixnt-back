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
  
  @Entity('lawyers')
  export class Lawyers {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    publicDefenderName: string;
    @Column()
    publicDefenderPhone: string;
    @Column()
    publicDefenderAddress: string;
    @Column()
    publicDefenderEmail: string;
    @Column()
    publicDefenderCompany: string;
    @Column()
    publicDefenderStartDate: string;
    @Column()
    publicDefenderEndDate: string;
    @Column()
    howManyProceedingsNumber: number;
    @Column()
    proceedingsNumbers: string;
    @Column({default: true})
    publicDefenderState: boolean;
    @Column({
      name: 'medio_a_comunicar',
      default: 'email',
      nullable: true,
    })
    medioAComunicar: string;
  
    @Column({ nullable: true })
    publicDefenderId: string;
  
    @Exclude()
    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;
  
    @Exclude()
    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date;
  }
  