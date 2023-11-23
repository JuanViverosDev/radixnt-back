// import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsBoolean, IsArray, IsNumber } from 'class-validator';

export class UpdateModuleDto {
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

    @IsNotEmpty()
    @IsBoolean()
    moduleState: boolean;
}


