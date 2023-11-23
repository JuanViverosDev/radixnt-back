"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("../auth/auth.module");
const catModules_entity_1 = require("./entities/catModules.entity");
const modules_entity_1 = require("./entities/modules.entity");
const positions_entity_1 = require("./entities/positions.entity");
const roles_entity_1 = require("./entities/roles.entity");
const users_entity_1 = require("./entities/users.entity");
const users_controller_1 = require("./users.controller");
const users_service_1 = require("./users.service");
const requestDisciplined_entity_1 = require("../requests/entities/requestDisciplined.entity");
const axios_1 = require("@nestjs/axios");
let UsersModule = class UsersModule {
};
UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule,
            typeorm_1.TypeOrmModule.forFeature([users_entity_1.Users, positions_entity_1.Positions, roles_entity_1.Roles, modules_entity_1.Modules, catModules_entity_1.CategoryModule, requestDisciplined_entity_1.RequestDisciplined]),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule)
        ],
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService],
        exports: [users_service_1.UsersService]
    })
], UsersModule);
exports.UsersModule = UsersModule;
//# sourceMappingURL=users.module.js.map