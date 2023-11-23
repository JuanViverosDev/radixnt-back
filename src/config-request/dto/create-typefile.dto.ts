// import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsFirebasePushId, IsOptional, IsEmail, IsUUID } from 'class-validator';

export class CreateTypeFileDto { 
    @IsNotEmpty()
    typeFileName: string;
}


