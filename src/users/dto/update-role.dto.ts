// import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class UpdateRoleDto { 
    @IsNotEmpty()
    roleName: string;

    @IsArray()
    roleModules: string[];

    @IsNotEmpty()
    @IsBoolean()
    roleState: boolean;
}


