// import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsFirebasePushId, IsOptional, IsEmail, IsUUID } from 'class-validator';

export class CreateUserDto { 
    @IsNotEmpty()
    userName: string;
    
    @IsNotEmpty()
    userLastName: string;
    
    @IsNotEmpty()
    @IsEmail()
    userEmail: string;

    @IsOptional()
    @IsUUID()
    position_id: string;

    @IsOptional()
    @IsUUID()
    role_id: string;
    
    @IsFirebasePushId()
    @IsOptional()
    fireBaseUUID: string;

    @IsNotEmpty()
    password: string;

    @IsOptional()
    roles: string[];
}


