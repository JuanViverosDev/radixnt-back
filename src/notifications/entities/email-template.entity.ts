import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('email_templates')
export class EmailTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  subject: string;

  @Column()
  body: string;
}