// import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class UserFireBaseDto {
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;
}