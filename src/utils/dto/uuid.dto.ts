import { IsNotEmpty, IsUUID } from 'class-validator';

export class ParamUuidDto {
    @IsUUID()
    @IsNotEmpty()
    id: string;
}