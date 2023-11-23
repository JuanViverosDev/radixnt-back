// import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsBoolean, IsString, IsNumber } from 'class-validator';

export class UpdateLawyersDto { 
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    publicDefenderName: string;
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    publicDefenderPhone: string;
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    publicDefenderAddress: string;
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    publicDefenderEmail: string;
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    publicDefenderCompany: string;
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    publicDefenderStartDate: string;
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    publicDefenderEndDate: string;
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    howManyProceedingsNumber: number;
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    proceedingsNumbers: string;
    @IsOptional()
    @IsNotEmpty()
    @IsBoolean()
    publicDefenderState: boolean;
    @IsOptional()
    medioAComunicar: string;
    @IsOptional()
    publicDefenderId: string;
}




