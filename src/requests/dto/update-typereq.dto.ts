// import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class UpdateTypeReqDto { 
    @IsNotEmpty()
    @IsOptional()
    typeReqName: string;

    @IsNotEmpty()
    @IsBoolean()
    typeReqState: boolean;
}




