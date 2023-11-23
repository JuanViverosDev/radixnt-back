// import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class UpdateTypeFileDto { 
    @IsOptional()
    @IsNotEmpty()
    typeFileName: string;

    @IsOptional()
    @IsNotEmpty()
    @IsBoolean()
    typeFileState: boolean;
}




