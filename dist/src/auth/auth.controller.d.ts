import { Users } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { ParamUuidDto } from 'src/utils/dto/uuid.dto';
import { UtilsService } from '../utils/utils.service';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-pass-firebase.dto';
import { UserFireBaseDto } from './dto/create-user-firebase.dto';
export declare class AuthController {
    private readonly _authService;
    private readonly _utilsService;
    private readonly _usersService;
    constructor(_authService: AuthService, _utilsService: UtilsService, _usersService: UsersService);
    ChangePassword(infoUser: ChangePasswordDto, param: ParamUuidDto): Promise<void | {
        success: boolean;
    }>;
    LoginUser(infoUser: UserFireBaseDto): Promise<void | {
        success: boolean;
        data: {
            stsTokenManager: {
                token: any;
                id: any;
            };
            user: Users;
            menu: any;
        };
    }>;
}
