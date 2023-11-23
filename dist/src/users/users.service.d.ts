import { Repository } from 'typeorm';
import { CreateModuleDto } from './dto/create-module.dto';
import { CreatePositionDto } from './dto/create-position.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CategoryModule } from './entities/catModules.entity';
import { Modules } from './entities/modules.entity';
import { Positions } from './entities/positions.entity';
import { Roles } from './entities/roles.entity';
import { Users } from './entities/users.entity';
import { RequestDisciplined } from '../requests/entities/requestDisciplined.entity';
import { HttpService } from '@nestjs/axios';
export declare class UsersService {
    private readonly repositoryUsers;
    private readonly repositoryRoles;
    private readonly repositoryPositions;
    private readonly repositoryModules;
    private readonly repositoryCategoryModule;
    private readonly repositoryDisciplined;
    private readonly httpService;
    constructor(repositoryUsers: Repository<Users>, repositoryRoles: Repository<Roles>, repositoryPositions: Repository<Positions>, repositoryModules: Repository<Modules>, repositoryCategoryModule: Repository<CategoryModule>, repositoryDisciplined: Repository<RequestDisciplined>, httpService: HttpService);
    getUserById(id: string): Promise<{
        success: boolean;
        data: Users;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    getUserByFireBaseUUID(fireBaseUUID: string): Promise<{
        success: boolean;
        data: Users;
        code?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        code: string;
        data?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
        code?: undefined;
    }>;
    getAllUsers(): Promise<{
        success: boolean;
        data: Users[];
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    CreateUser(user: CreateUserDto): Promise<{
        success: boolean;
        data: Users;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    ModifyUser(id: string, user: UpdateUserDto): Promise<{
        success: boolean;
        code: string;
        data?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        data: Users;
        code?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        code?: undefined;
        data?: undefined;
    }>;
    getAllRoles(): Promise<{
        success: boolean;
        data: Roles[];
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    CreateRole(infoRole: CreateRoleDto): Promise<{
        success: boolean;
        data: Roles;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    ModifyRole(id: string, infoRole: UpdateRoleDto): Promise<{
        success: boolean;
        code: string;
        data?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        data: Roles;
        code?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        code?: undefined;
        data?: undefined;
    }>;
    getAllPosition(): Promise<{
        success: boolean;
        data: Positions[];
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    CreatePosition(infoPosition: CreatePositionDto): Promise<{
        success: boolean;
        data: Positions;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    ModifyPosition(id: string, infoPosition: UpdatePositionDto): Promise<{
        success: boolean;
        code: string;
        data?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        data: Positions;
        code?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        code?: undefined;
        data?: undefined;
    }>;
    getAllModules(): Promise<{
        success: boolean;
        data: Modules[];
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    CreateModule(infoModule: CreateModuleDto): Promise<{
        success: boolean;
        data: Modules;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    ModifyModule(id: string, infoModule: UpdateModuleDto): Promise<{
        success: boolean;
        code: string;
        data?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        data: Modules;
        code?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        code?: undefined;
        data?: undefined;
    }>;
    getMenu(user: Users): Promise<{
        success: boolean;
        data: CategoryModule[];
        code?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        code: string;
        data?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
        code?: undefined;
    }>;
    getUserByRoleName(roleName: string): Promise<{
        success: boolean;
        data: Users;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    getDisciplinados(): Promise<{
        success: boolean;
        data: any[];
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    getDisciplined(): Promise<{
        success: boolean;
        data: RequestDisciplined[];
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
}
