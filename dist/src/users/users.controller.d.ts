import { AuthService } from 'src/auth/auth.service';
import { responseDto } from 'src/utils/dto/response.dto';
import { UtilsService } from 'src/utils/utils.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParamUuidDto } from 'src/utils/dto/uuid.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { CreateModuleDto } from './dto/create-module.dto';
export declare class UsersController {
    private readonly _authService;
    private readonly _userService;
    private readonly _utilsService;
    constructor(_authService: AuthService, _userService: UsersService, _utilsService: UtilsService);
    GetUsers(): Promise<{
        success: boolean;
        data: import("./entities/users.entity").Users[];
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    CreateUser(req: any, infoUser: CreateUserDto): Promise<{
        success: boolean;
        data: import("./entities/users.entity").Users;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    ModifyUser(params: ParamUuidDto, infoUser: UpdateUserDto): Promise<responseDto>;
    GetRoles(): Promise<{
        success: boolean;
        data: import("./entities/roles.entity").Roles[];
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    CreateRole(infoRole: CreateRoleDto): Promise<{
        success: boolean;
        data: import("./entities/roles.entity").Roles;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    ModifyRole(params: ParamUuidDto, infoRole: UpdateRoleDto): Promise<{
        success: boolean;
        code: string;
        data?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        data: import("./entities/roles.entity").Roles;
        code?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        code?: undefined;
        data?: undefined;
    }>;
    GetPosition(): Promise<{
        success: boolean;
        data: import("./entities/positions.entity").Positions[];
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    CreatePosition(infoPosition: CreatePositionDto): Promise<{
        success: boolean;
        data: import("./entities/positions.entity").Positions;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    ModifyPosition(params: ParamUuidDto, infoPosition: UpdatePositionDto): Promise<{
        success: boolean;
        code: string;
        data?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        data: import("./entities/positions.entity").Positions;
        code?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        code?: undefined;
        data?: undefined;
    }>;
    GetModule(): Promise<{
        success: boolean;
        data: import("./entities/modules.entity").Modules[];
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    CreateModule(infoModule: CreateModuleDto): Promise<{
        success: boolean;
        data: import("./entities/modules.entity").Modules;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    ModifyModule(params: ParamUuidDto, infoModule: UpdateModuleDto): Promise<{
        success: boolean;
        code: string;
        data?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        data: import("./entities/modules.entity").Modules;
        code?: undefined;
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        code?: undefined;
        data?: undefined;
    }>;
    GetDisciplinados(): Promise<{
        success: boolean;
        data: any[];
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
    getDisciplined(): Promise<void | {
        success: boolean;
        data: import("../requests/entities/requestDisciplined.entity").RequestDisciplined[];
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
}
