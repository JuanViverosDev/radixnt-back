// import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class UpdateCommunicationDto { 
    @IsOptional()
    @IsNotEmpty()
    communicationName: string;

    @IsOptional()
    @IsNotEmpty()
    @IsBoolean()
    communicationState: boolean;
}




