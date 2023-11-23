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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const class_transformer_1 = require("class-transformer");
const users_entity_1 = require("../users/entities/users.entity");
const users_service_1 = require("../users/users.service");
const uuid_dto_1 = require("../utils/dto/uuid.dto");
const utils_service_1 = require("../utils/utils.service");
const auth_service_1 = require("./auth.service");
const change_pass_firebase_dto_1 = require("./dto/change-pass-firebase.dto");
const create_user_firebase_dto_1 = require("./dto/create-user-firebase.dto");
let AuthController = class AuthController {
    constructor(_authService, _utilsService, _usersService) {
        this._authService = _authService;
        this._utilsService = _utilsService;
        this._usersService = _usersService;
    }
    async ChangePassword(infoUser, param) {
        const userUpdate = await this._usersService.getUserById(param.id);
        if (!userUpdate.success || (userUpdate.success && !userUpdate.data))
            return await this._utilsService.handleError({ success: false, code: 'CD001' });
        const user = userUpdate.data;
        const change = await this._authService.changePasswordUser(user.userEmail, infoUser);
        if (!change.success)
            return await this._utilsService.handleError(change);
        return change;
    }
    async LoginUser(infoUser) {
        const userLogin = await this._authService.loginUser(infoUser);
        if (!userLogin.success)
            return await this._utilsService.handleError(userLogin);
        const token = this._authService.processLogin(userLogin);
        const userRespose = await this._usersService.getUserByFireBaseUUID(token.id);
        if (!userRespose.success)
            return await this._utilsService.handleError(userRespose);
        const userMenu = await this._usersService.getMenu(userRespose.data);
        if (!userMenu.success)
            return await this._utilsService.handleError(userMenu);
        return {
            success: true,
            data: {
                stsTokenManager: token,
                user: (0, class_transformer_1.plainToInstance)(users_entity_1.Users, userRespose.data),
                menu: userMenu.data
            }
        };
    }
};
__decorate([
    (0, common_1.Post)('changepassword/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [change_pass_firebase_dto_1.ChangePasswordDto, uuid_dto_1.ParamUuidDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "ChangePassword", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_firebase_dto_1.UserFireBaseDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "LoginUser", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        utils_service_1.UtilsService,
        users_service_1.UsersService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map