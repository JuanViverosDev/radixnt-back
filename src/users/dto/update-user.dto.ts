// import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsNotEmpty()
  userName: string;

  @IsOptional()
  @IsNotEmpty()
  userLastName: string;

  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  userEmail: string;

  @IsOptional()
  @IsUUID()
  position_id: string;

  @IsOptional()
  @IsUUID()
  role_id: string;

  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  userState: boolean;

  @IsOptional()
  roles: string[];
}
