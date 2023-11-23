import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('config')
export class Config {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({name: "varios_consecutive"})
  variosConsecutive: number;

  @Column({name: "prefix"})
  prefix: string;

  @Column({nullable: true})
  consecutive: number;
}