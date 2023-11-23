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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const class_transformer_1 = require("class-transformer");
const typeorm_2 = require("typeorm");
const catModules_entity_1 = require("./entities/catModules.entity");
const modules_entity_1 = require("./entities/modules.entity");
const positions_entity_1 = require("./entities/positions.entity");
const roles_entity_1 = require("./entities/roles.entity");
const users_entity_1 = require("./entities/users.entity");
const requestDisciplined_entity_1 = require("../requests/entities/requestDisciplined.entity");
const axios_1 = require("@nestjs/axios");
let UsersService = class UsersService {
    constructor(repositoryUsers, repositoryRoles, repositoryPositions, repositoryModules, repositoryCategoryModule, repositoryDisciplined, httpService) {
        this.repositoryUsers = repositoryUsers;
        this.repositoryRoles = repositoryRoles;
        this.repositoryPositions = repositoryPositions;
        this.repositoryModules = repositoryModules;
        this.repositoryCategoryModule = repositoryCategoryModule;
        this.repositoryDisciplined = repositoryDisciplined;
        this.httpService = httpService;
    }
    async getUserById(id) {
        try {
            const currentUser = await this.repositoryUsers.findOne({
                where: {
                    id: id,
                },
            });
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(users_entity_1.Users, currentUser),
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async getUserByFireBaseUUID(fireBaseUUID) {
        try {
            const currentUser = await this.repositoryUsers.findOne({
                relations: ['userRole', 'roles'],
                where: {
                    fireBaseUUID: fireBaseUUID,
                },
            });
            if (currentUser) {
                return {
                    success: true,
                    data: (0, class_transformer_1.plainToInstance)(users_entity_1.Users, currentUser),
                };
            }
            else {
                return {
                    success: false,
                    code: 'CD001',
                };
            }
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async getAllUsers() {
        try {
            const listUsers = await this.repositoryUsers.find({
                relations: ['userRole', 'userPosition', 'roles'],
            });
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(users_entity_1.Users, listUsers),
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async CreateUser(user) {
        var _a;
        try {
            const currentRole = await this.repositoryRoles.findOne({
                where: { id: user.role_id },
            });
            const currentPosition = await this.repositoryPositions.findOne({
                where: { id: user.position_id },
            });
            const newUser = await this.repositoryUsers.save(Object.assign(Object.assign({}, user), { userRole: currentRole, userPosition: currentPosition, roles: (_a = user.roles) !== null && _a !== void 0 ? _a : [currentRole] }));
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(users_entity_1.Users, newUser),
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async ModifyUser(id, user) {
        try {
            const currentPosition = await this.repositoryPositions.findOne({
                where: { id: user.position_id },
            });
            const currentUser = await this.repositoryUsers.findOne({
                where: { id: id },
            });
            const newRoles = user.roles ? await this.repositoryRoles.find({
                where: { id: (0, typeorm_2.In)(user.roles) },
            }) : [];
            if (!currentUser) {
                return {
                    success: false,
                    code: 'CD002',
                };
            }
            if (user.userName)
                currentUser.userName = user.userName;
            if (user.userLastName)
                currentUser.userLastName = user.userLastName;
            if (user.userEmail)
                currentUser.userEmail = user.userEmail;
            currentUser.userState = user.userState;
            currentUser.userPosition = currentPosition;
            const existingRoles = currentUser.roles ? currentUser.roles : [];
            currentUser.roles = [...existingRoles, ...newRoles];
            const modifyUser = await this.repositoryUsers.save(currentUser);
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(users_entity_1.Users, modifyUser),
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async getAllRoles() {
        try {
            const listRoles = await this.repositoryRoles.find();
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(roles_entity_1.Roles, listRoles),
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async CreateRole(infoRole) {
        try {
            const listModules = await this.repositoryModules.findBy({
                id: (0, typeorm_2.In)(infoRole.roleModules),
            });
            const newRole = await this.repositoryRoles.create({
                roleName: infoRole.roleName,
            });
            if (listModules)
                newRole.roleModules = listModules;
            const saveRole = await this.repositoryRoles.save(newRole);
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(roles_entity_1.Roles, saveRole),
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async ModifyRole(id, infoRole) {
        try {
            const listModules = await this.repositoryModules.findBy({
                id: (0, typeorm_2.In)(infoRole.roleModules),
            });
            const currentRole = await this.repositoryRoles.findOne({
                where: { id: id },
            });
            if (!currentRole) {
                return {
                    success: false,
                    code: 'CD002',
                };
            }
            if (infoRole.roleName)
                currentRole.roleName = infoRole.roleName;
            currentRole.roleModules = listModules;
            currentRole.roleState = infoRole.roleState;
            const modifyRole = await this.repositoryRoles.save(currentRole);
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(roles_entity_1.Roles, modifyRole),
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async getAllPosition() {
        try {
            const listPosition = await this.repositoryPositions.find();
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(positions_entity_1.Positions, listPosition),
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async CreatePosition(infoPosition) {
        try {
            const savePosition = await this.repositoryPositions.save(infoPosition);
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(positions_entity_1.Positions, savePosition),
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async ModifyPosition(id, infoPosition) {
        try {
            const currentPosition = await this.repositoryPositions.findOne({
                where: { id: id },
            });
            if (!currentPosition) {
                return {
                    success: false,
                    code: 'CD002',
                };
            }
            if (infoPosition.positionName)
                currentPosition.positionName = infoPosition.positionName;
            currentPosition.positionState = infoPosition.positionState;
            const modifyPotition = await this.repositoryPositions.save(currentPosition);
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(positions_entity_1.Positions, modifyPotition),
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async getAllModules() {
        try {
            const listModules = await this.repositoryModules.find();
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(modules_entity_1.Modules, listModules),
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async CreateModule(infoModule) {
        try {
            const newModule = await this.repositoryModules.save({
                moduleName: infoModule.moduleName,
                moduleComponent: infoModule.moduleComponent,
                moduleUrl: infoModule.moduleUrl,
                moduleIcon: infoModule.moduleIcon,
                moduleOrder: infoModule.moduleOrder,
            });
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(modules_entity_1.Modules, newModule),
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async ModifyModule(id, infoModule) {
        try {
            const currentModule = await this.repositoryModules.findOne({
                where: { id: id },
            });
            if (!currentModule) {
                return {
                    success: false,
                    code: 'CD002',
                };
            }
            if (infoModule.moduleName)
                currentModule.moduleName = infoModule.moduleName;
            if (infoModule.moduleComponent)
                currentModule.moduleComponent = infoModule.moduleComponent;
            if (infoModule.moduleUrl)
                currentModule.moduleUrl = infoModule.moduleUrl;
            if (infoModule.moduleIcon)
                currentModule.moduleIcon = infoModule.moduleIcon;
            if (infoModule.moduleOrder)
                currentModule.moduleOrder = infoModule.moduleOrder;
            currentModule.moduleState = infoModule.moduleState;
            const modifyModule = await this.repositoryModules.save(currentModule);
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(modules_entity_1.Modules, modifyModule),
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async getMenu(user) {
        try {
            if (user && (user.userRole || user.roles)) {
                const data = await this.repositoryCategoryModule
                    .createQueryBuilder('c')
                    .select([
                    'c.id',
                    'c.categoryOrder',
                    'c.categoryName',
                    'c.categoryState',
                    'm.id',
                    'm.moduleOrder',
                    'm.moduleName',
                    'm.moduleState',
                    'm.moduleUrl',
                    'm.moduleIcon',
                    'm.permission',
                ])
                    .innerJoin('c.categoryModule', 'm')
                    .innerJoin('m.moduleRole', 'r')
                    .where(`m.moduleState = true and c.categoryState=true and r.roleState=true and r.id = :idrole ${user.roles.length > 0 ? 'OR r.id IN (:roles)' : ''}`, { idrole: user.userRole.id, roles: user.roles.map((r) => r.id).join(', ') })
                    .orderBy('c.categoryOrder, m.moduleOrder', 'ASC')
                    .getMany();
                return {
                    success: true,
                    data,
                };
            }
            else {
                return {
                    success: false,
                    code: 'CD001',
                };
            }
        }
        catch (error) {
            console.error(error);
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async getUserByRoleName(roleName) {
        try {
            const role = await this.repositoryRoles.findOne({
                where: {
                    roleName: roleName,
                },
            });
            if (!role) {
                throw new Error('Role not found');
            }
            const currentUser = await this.repositoryUsers.findOne({
                where: [
                    {
                        roles: {
                            id: role.id,
                        },
                    },
                    {
                        userRole: {
                            id: role.id,
                        },
                    },
                ],
            });
            if (!currentUser) {
                throw new Error('No user found with rolename');
            }
            return {
                success: true,
                data: (0, class_transformer_1.plainToInstance)(users_entity_1.Users, currentUser),
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async getDisciplinados() {
        try {
            const lstDisciplined = [];
            let empleado = {
                empleado: {
                    codigo: '04518',
                    cedula: '31920470',
                    nombre: 'NANCY',
                    primerApellido: 'LOPEZ',
                    segundoApellido: 'BOTERO',
                    planilla: '44',
                    gradoNombre: 'PROFESIONAL ADMINISTRATIVO I',
                    fechaIngreso: '1989-04-03',
                    tipoVinculacion: 'OFICIAL',
                    tipoContrato: 'TERMINO INDEFINIDO',
                    sueldoMensual: 9530100.0,
                    direccionResid: 'CALLE 30 NO.1-25 CASA 33',
                    ciudadResid: 'CALI',
                    codCiudadResid: 1,
                    codDptoResid: 76,
                    nombreDptoResid: 'VALLE',
                    telefonos: '5191412',
                    email: 'nalopez@emcali.com.co',
                    codSociedad: 7,
                    nombreSociedad: 'EMCALI EICE  ESP',
                    codConvencion: 2,
                    nombreConvencion: 'SINDICATO USE',
                    codEmpresa: 1,
                    codEstDos: 777,
                    codEstTres: 0,
                    codEstCuatro: 10,
                    codEstCinco: 2,
                    codEstSeis: 0,
                    codCentroCostos: '20771100323500',
                    periodosVacacionales: [],
                    acumuladosPagados: [],
                    resultado: 'ok',
                    mensaje: 'ok',
                },
            };
            lstDisciplined.push(empleado);
            return {
                success: true,
                data: lstDisciplined,
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async getDisciplined() {
        try {
            const disciplined = await this.repositoryDisciplined.find();
            return {
                success: true,
                data: disciplined,
            };
        }
        catch (err) {
            return {
                success: false,
                message: err.message,
            };
        }
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(users_entity_1.Users)),
    __param(1, (0, typeorm_1.InjectRepository)(roles_entity_1.Roles)),
    __param(2, (0, typeorm_1.InjectRepository)(positions_entity_1.Positions)),
    __param(3, (0, typeorm_1.InjectRepository)(modules_entity_1.Modules)),
    __param(4, (0, typeorm_1.InjectRepository)(catModules_entity_1.CategoryModule)),
    __param(5, (0, typeorm_1.InjectRepository)(requestDisciplined_entity_1.RequestDisciplined)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        axios_1.HttpService])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map