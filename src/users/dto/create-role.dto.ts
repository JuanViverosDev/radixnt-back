// import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateRoleDto { 
    @IsNotEmpty()
    roleName: string;

    @IsArray()
    roleModules: string[];
}


