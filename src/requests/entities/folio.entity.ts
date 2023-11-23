import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {RequestHeader} from "./request.entity";

@Entity('folio')
export class Folio {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    base64: string;

    @OneToOne(() => RequestHeader)
    @JoinColumn({name: 'id_request'})
    requestHeader: RequestHeader | string;
}