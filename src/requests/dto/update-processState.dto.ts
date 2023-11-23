// import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class UpdateProcessStateDto { 
    @IsOptional()
    @IsNotEmpty()
    processStateName: string;

    @IsOptional()
    @IsNotEmpty()
    @IsBoolean()
    processStateState: boolean;
}




