// import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class UpdatePositionDto { 
    @IsNotEmpty()
    @IsOptional()
    positionName: string;

    @IsNotEmpty()
    @IsBoolean()
    positionState: boolean;
}




