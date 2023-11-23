import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';
import { Users } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { responseDto } from 'src/utils/dto/response.dto';
import { ParamUuidDto } from 'src/utils/dto/uuid.dto';
import { UtilsService } from '../utils/utils.service';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-pass-firebase.dto';
import { UserFireBaseDto } from './dto/create-user-firebase.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly _authService: AuthService,
        private readonly _utilsService: UtilsService,
        private readonly _usersService: UsersService,
    ){}

    @Post('changepassword/:id')
    @UseGuards(AuthGuard('jwt'))
    async ChangePassword(@Body() infoUser : ChangePasswordDto, @Param() param : ParamUuidDto ){
        const userUpdate = await this._usersService.getUserById(param.id)
        if(!userUpdate.success || (userUpdate.success && !userUpdate.data) ) return await this._utilsService.handleError({success: false, code: 'CD001'});
        
        const user= userUpdate.data;
        const change = await this._authService.changePasswordUser(user.userEmail, infoUser);

        if(!change.success) return await this._utilsService.handleError(change);

        return change;
    }

    @Post('login')
    async LoginUser(@Body() infoUser : UserFireBaseDto){
        const userLogin =  await this._authService.loginUser(infoUser);

        if(!userLogin.success)
            return await this._utilsService.handleError(userLogin);
        
        const token = this._authService.processLogin(userLogin);

        const userRespose: responseDto = await this._usersService.getUserByFireBaseUUID(token.id);

        if(!userRespose.success)
            return await this._utilsService.handleError(userRespose);

        const userMenu: responseDto = await this._usersService.getMenu(userRespose.data);
        
        if(!userMenu.success)
            return await this._utilsService.handleError(userMenu);

        return {
            success: true,
            data: {
                stsTokenManager: token,
                user: plainToInstance(Users, userRespose.data),
                menu: userMenu.data
            }
        }
    }
}
