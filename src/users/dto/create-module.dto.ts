// import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty,  IsOptional, IsArray, IsNumber } from 'class-validator';

export class CreateModuleDto { 
    @IsNotEmpty()
    moduleName: string;
    
    @IsOptional()
    moduleComponent: string;
    
    @IsOptional()
    moduleUrl: string;

    @IsNotEmpty()
    moduleIcon: string;

    @IsNumber()
    moduleOrder: number;

    // @IsOptional()
    // @IsArray()
    // moduleRole: string[];
}