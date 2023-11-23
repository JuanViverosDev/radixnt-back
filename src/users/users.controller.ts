import {
  Body,
  Controller,
  forwardRef,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { responseDto } from 'src/utils/dto/response.dto';
import { UtilsService } from 'src/utils/utils.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParamUuidDto } from 'src/utils/dto/uuid.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { CreateModuleDto } from './dto/create-module.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _userService: UsersService,
    private readonly _utilsService: UtilsService,
  ) {}

  @Get('')
  async GetUsers() {
    const listUsers = await this._userService.getAllUsers();
    return listUsers;
  }

  @Post('createuser')
  //@UseGuards(AuthGuard('jwt'))
  async CreateUser(@Req() req, @Body() infoUser: CreateUserDto) {
    const firebaseUser: responseDto =
      await this._authService.createFirebaseUser({
        email: infoUser.userEmail,
        password: infoUser.password,
      });
    if (!firebaseUser.success)
      await this._utilsService.handleError(firebaseUser);

    infoUser.fireBaseUUID = firebaseUser.data.uid;
    const user = await this._userService.CreateUser(infoUser);
    if (!user.success) await this._utilsService.handleError(user);

    return user;
  }

  @Patch('modifyuser/:id')
  async ModifyUser(
    @Param() params: ParamUuidDto,
    @Body() infoUser: UpdateUserDto,
  ) {
    const modifyUser: responseDto = await this._userService.ModifyUser(
      params.id,
      infoUser,
    );

    if (!modifyUser.success) await this._utilsService.handleError(modifyUser);

    return modifyUser;
  }

  @Get('roles')
  async GetRoles() {
    const listRoles = await this._userService.getAllRoles();
    return listRoles;
  }

  @Post('createrole')
  async CreateRole(@Body() infoRole: CreateRoleDto) {
    const role = await this._userService.CreateRole(infoRole);
    if (!role.success) await this._utilsService.handleError(role);

    return role;
  }

  @Patch('modifyrole/:id')
  async ModifyRole(
    @Param() params: ParamUuidDto,
    @Body() infoRole: UpdateRoleDto,
  ) {
    const role = await this._userService.ModifyRole(params.id, infoRole);
    if (!role.success) await this._utilsService.handleError(role);

    return role;
  }

  @Get('position')
  async GetPosition() {
    const listPosition = await this._userService.getAllPosition();
    return listPosition;
  }

  @Post('createposition')
  async CreatePosition(@Body() infoPosition: CreatePositionDto) {
    const Position = await this._userService.CreatePosition(infoPosition);
    if (!Position.success) await this._utilsService.handleError(Position);

    return Position;
  }

  @Patch('modifyposition/:id')
  async ModifyPosition(
    @Param() params: ParamUuidDto,
    @Body() infoPosition: UpdatePositionDto,
  ) {
    const Position = await this._userService.ModifyPosition(
      params.id,
      infoPosition,
    );
    if (!Position.success) await this._utilsService.handleError(Position);

    return Position;
  }

  @Get('modules')
  async GetModule() {
    const listModule = await this._userService.getAllModules();
    return listModule;
  }

  @Post('createmodule')
  async CreateModule(@Body() infoModule: CreateModuleDto) {
    const Module = await this._userService.CreateModule(infoModule);
    if (!Module.success) await this._utilsService.handleError(Module);

    return Module;
  }

  @Patch('modifymodule/:id')
  async ModifyModule(
    @Param() params: ParamUuidDto,
    @Body() infoModule: UpdateModuleDto,
  ) {
    const Module = await this._userService.ModifyModule(
      params.id,
      infoModule,
    );
    if (!Module.success) await this._utilsService.handleError(Module);

    return Module;
  }

  @Get('disciplinados')
  async GetDisciplinados() {
    const listModule = await this._userService.getDisciplinados();
    return listModule;
  }

  @Get('disciplined')
  async getDisciplined() {
    const response = await this._userService.getDisciplined();
    if (!response.success) return this._utilsService.handleError(response);
    return response;
  }
}
