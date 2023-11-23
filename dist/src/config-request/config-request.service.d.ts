import { Repository } from 'typeorm';
import { CreateLawyersDto } from './dto/create-lawyers.dto';
import { CreateTypeFileDto } from './dto/create-typefile.dto';
import { UpdateLawyersDto } from './dto/update-lawyers.dto';
import { UpdateTypeFileDto } from './dto/update-typefile.dto';
import { Lawyers } from './entities/lawyers.entity';
import { TypeFile } from './entities/typeFile.entity';
export declare class ConfigRequestService {
    private readonly repositoryTypeFile;
    private readonly repositoryLawyers;
    constructor(repositoryTypeFile: Repository<TypeFile>, repositoryLawyers: Repository<Lawyers>);
    createTypeFile(createTypeDto: CreateTypeFileDto): Promise<{
        success: boolean;
        data: TypeFile;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    findAllTypeFile(): Promise<{
        success: boolean;
        data: TypeFile[];
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    ModifyTypeFile(id: string, updateTypeFileDto: UpdateTypeFileDto): Promise<{
        success: boolean;
        code: string;
        data?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        data: TypeFile;
        code?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        code?: undefined;
        data?: undefined;
    }>;
    createLawyer(createLawyerDto: CreateLawyersDto): Promise<{
        success: boolean;
        data: Lawyers;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    findAllLawyer(): Promise<{
        success: boolean;
        data: Lawyers[];
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    getOneLawyer(id: string): Promise<{
        success: boolean;
        data: Lawyers;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    updateLawyer(id: string, updateLawyerDto: UpdateLawyersDto): Promise<{
        success: boolean;
        code: string;
        data?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        data: Lawyers;
        code?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        code?: undefined;
        data?: undefined;
    }>;
}
