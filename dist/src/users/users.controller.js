"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../auth/auth.service");
const utils_service_1 = require("../utils/utils.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const users_service_1 = require("./users.service");
const update_user_dto_1 = require("./dto/update-user.dto");
const uuid_dto_1 = require("../utils/dto/uuid.dto");
const create_role_dto_1 = require("./dto/create-role.dto");
const update_role_dto_1 = require("./dto/update-role.dto");
const create_position_dto_1 = require("./dto/create-position.dto");
const update_position_dto_1 = require("./dto/update-position.dto");
const update_module_dto_1 = require("./dto/update-module.dto");
const create_module_dto_1 = require("./dto/create-module.dto");
let UsersController = class UsersController {
    constructor(_authService, _userService, _utilsService) {
        this._authService = _authService;
        this._userService = _userService;
        this._utilsService = _utilsService;
    }
    async GetUsers() {
        const listUsers = await this._userService.getAllUsers();
        return listUsers;
    }
    async CreateUser(req, infoUser) {
        const firebaseUser = await this._authService.createFirebaseUser({
            email: infoUser.userEmail,
            password: infoUser.password,
        });
        if (!firebaseUser.success)
            await this._utilsService.handleError(firebaseUser);
        infoUser.fireBaseUUID = firebaseUser.data.uid;
        const user = await this._userService.CreateUser(infoUser);
        if (!user.success)
            await this._utilsService.handleError(user);
        return user;
    }
    async ModifyUser(params, infoUser) {
        const modifyUser = await this._userService.ModifyUser(params.id, infoUser);
        if (!modifyUser.success)
            await this._utilsService.handleError(modifyUser);
        return modifyUser;
    }
    async GetRoles() {
        const listRoles = await this._userService.getAllRoles();
        return listRoles;
    }
    async CreateRole(infoRole) {
        const role = await this._userService.CreateRole(infoRole);
        if (!role.success)
            await this._utilsService.handleError(role);
        return role;
    }
    async ModifyRole(params, infoRole) {
        const role = await this._userService.ModifyRole(params.id, infoRole);
        if (!role.success)
            await this._utilsService.handleError(role);
        return role;
    }
    async GetPosition() {
        const listPosition = await this._userService.getAllPosition();
        return listPosition;
    }
    async CreatePosition(infoPosition) {
        const Position = await this._userService.CreatePosition(infoPosition);
        if (!Position.success)
            await this._utilsService.handleError(Position);
        return Position;
    }
    async ModifyPosition(params, infoPosition) {
        const Position = await this._userService.ModifyPosition(params.id, infoPosition);
        if (!Position.success)
            await this._utilsService.handleError(Position);
        return Position;
    }
    async GetModule() {
        const listModule = await this._userService.getAllModules();
        return listModule;
    }
    async CreateModule(infoModule) {
        const Module = await this._userService.CreateModule(infoModule);
        if (!Module.success)
            await this._utilsService.handleError(Module);
        return Module;
    }
    async ModifyModule(params, infoModule) {
        const Module = await this._userService.ModifyModule(params.id, infoModule);
        if (!Module.success)
            await this._utilsService.handleError(Module);
        return Module;
    }
    async GetDisciplinados() {
        const listModule = await this._userService.getDisciplinados();
        return listModule;
    }
    async getDisciplined() {
        const response = await this._userService.getDisciplined();
        if (!response.success)
            return this._utilsService.handleError(response);
        return response;
    }
};
__decorate([
    (0, common_1.Get)(''),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "GetUsers", null);
__decorate([
    (0, common_1.Post)('createuser'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "CreateUser", null);
__decorate([
    (0, common_1.Patch)('modifyuser/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [uuid_dto_1.ParamUuidDto,
        update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "ModifyUser", null);
__decorate([
    (0, common_1.Get)('roles'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "GetRoles", null);
__decorate([
    (0, common_1.Post)('createrole'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_role_dto_1.CreateRoleDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "CreateRole", null);
__decorate([
    (0, common_1.Patch)('modifyrole/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [uuid_dto_1.ParamUuidDto,
        update_role_dto_1.UpdateRoleDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "ModifyRole", null);
__decorate([
    (0, common_1.Get)('position'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "GetPosition", null);
__decorate([
    (0, common_1.Post)('createposition'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_position_dto_1.CreatePositionDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "CreatePosition", null);
__decorate([
    (0, common_1.Patch)('modifyposition/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [uuid_dto_1.ParamUuidDto,
        update_position_dto_1.UpdatePositionDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "ModifyPosition", null);
__decorate([
    (0, common_1.Get)('modules'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "GetModule", null);
__decorate([
    (0, common_1.Post)('createmodule'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_module_dto_1.CreateModuleDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "CreateModule", null);
__decorate([
    (0, common_1.Patch)('modifymodule/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [uuid_dto_1.ParamUuidDto,
        update_module_dto_1.UpdateModuleDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "ModifyModule", null);
__decorate([
    (0, common_1.Get)('disciplinados'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "GetDisciplinados", null);
__decorate([
    (0, common_1.Get)('disciplined'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getDisciplined", null);
UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        users_service_1.UsersService,
        utils_service_1.UtilsService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map