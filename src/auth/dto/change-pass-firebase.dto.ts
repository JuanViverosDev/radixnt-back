// import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    newPassword?: string;
}