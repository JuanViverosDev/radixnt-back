import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { In, Repository } from 'typeorm';
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
import { DisciplinedDto } from 'src/utils/dto/disciplined.response.dto';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly repositoryUsers: Repository<Users>,
    @InjectRepository(Roles)
    private readonly repositoryRoles: Repository<Roles>,
    @InjectRepository(Positions)
    private readonly repositoryPositions: Repository<Positions>,
    @InjectRepository(Modules)
    private readonly repositoryModules: Repository<Modules>,
    @InjectRepository(CategoryModule)
    private readonly repositoryCategoryModule: Repository<CategoryModule>,
    @InjectRepository(RequestDisciplined)
    private readonly repositoryDisciplined: Repository<RequestDisciplined>,
    private readonly httpService: HttpService,
  ) {}

  async getUserById(id: string) {
    try {
      const currentUser = await this.repositoryUsers.findOne({
        where: {
          id: id,
        },
      });
      return {
        success: true,
        data: plainToInstance(Users, currentUser),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async getUserByFireBaseUUID(fireBaseUUID: string) {
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
          data: plainToInstance(Users, currentUser),
        };
      } else {
        return {
          success: false,
          code: 'CD001',
        };
      }
    } catch (error) {
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
        data: plainToInstance(Users, listUsers),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async CreateUser(user: CreateUserDto) {
    try {
      const currentRole = await this.repositoryRoles.findOne({
        where: { id: user.role_id },
      });
      const currentPosition = await this.repositoryPositions.findOne({
        where: { id: user.position_id },
      });

      const newUser = await this.repositoryUsers.save({
        ...user,
        userRole: currentRole,
        userPosition: currentPosition,
        roles: user.roles ?? [currentRole],
      });
      return {
        success: true,
        data: plainToInstance(Users, newUser),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async ModifyUser(id: string, user: UpdateUserDto) {
    try {
      const currentPosition = await this.repositoryPositions.findOne({
        where: { id: user.position_id },
      });

      const currentUser = await this.repositoryUsers.findOne({
        where: { id: id },
      });

      const newRoles = user.roles ?  await this.repositoryRoles.find({
        where: { id: In(user.roles) },
      }) : [];

      if (!currentUser) {
        return {
          success: false,
          code: 'CD002',
        };
      }
      if (user.userName) currentUser.userName = user.userName;
      if (user.userLastName) currentUser.userLastName = user.userLastName;
      if (user.userEmail) currentUser.userEmail = user.userEmail;
      currentUser.userState = user.userState;
      currentUser.userPosition = currentPosition;

      const existingRoles = currentUser.roles ? currentUser.roles : []
      currentUser.roles = [...existingRoles, ...newRoles] as Roles[]
      const modifyUser = await this.repositoryUsers.save(currentUser);
      return {
        success: true,
        data: plainToInstance(Users, modifyUser),
      };
    } catch (error) {
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
        data: plainToInstance(Roles, listRoles),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async CreateRole(infoRole: CreateRoleDto) {
    try {
      const listModules = await this.repositoryModules.findBy({
        id: In(infoRole.roleModules),
      });
      const newRole = await this.repositoryRoles.create({
        roleName: infoRole.roleName,
      });

      if (listModules) newRole.roleModules = listModules;

      const saveRole = await this.repositoryRoles.save(newRole);
      return {
        success: true,
        data: plainToInstance(Roles, saveRole),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async ModifyRole(id: string, infoRole: UpdateRoleDto) {
    try {
      const listModules = await this.repositoryModules.findBy({
        id: In(infoRole.roleModules),
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
      if (infoRole.roleName) currentRole.roleName = infoRole.roleName;
      currentRole.roleModules = listModules;
      currentRole.roleState = infoRole.roleState;

      const modifyRole = await this.repositoryRoles.save(currentRole);
      return {
        success: true,
        data: plainToInstance(Roles, modifyRole),
      };
    } catch (error) {
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
        data: plainToInstance(Positions, listPosition),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async CreatePosition(infoPosition: CreatePositionDto) {
    try {
      const savePosition = await this.repositoryPositions.save(infoPosition);
      return {
        success: true,
        data: plainToInstance(Positions, savePosition),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async ModifyPosition(id: string, infoPosition: UpdatePositionDto) {
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

      const modifyPotition = await this.repositoryPositions.save(
        currentPosition,
      );
      return {
        success: true,
        data: plainToInstance(Positions, modifyPotition),
      };
    } catch (error) {
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
        data: plainToInstance(Modules, listModules),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async CreateModule(infoModule: CreateModuleDto) {
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
        data: plainToInstance(Modules, newModule),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async ModifyModule(id: string, infoModule: UpdateModuleDto) {
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
      if (infoModule.moduleUrl) currentModule.moduleUrl = infoModule.moduleUrl;
      if (infoModule.moduleIcon)
        currentModule.moduleIcon = infoModule.moduleIcon;
      if (infoModule.moduleOrder)
        currentModule.moduleOrder = infoModule.moduleOrder;

      currentModule.moduleState = infoModule.moduleState;

      const modifyModule = await this.repositoryModules.save(currentModule);
      return {
        success: true,
        data: plainToInstance(Modules, modifyModule),
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async getMenu(user: Users) {
    try {
      if (user && (user.userRole || user.roles) ) {
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
          // .leftJoin('m.permission', 'p_m')
          //.leftJoin('permission_module', 'p_m', ' "p_m"."idModule"= "m"."id" ')
          .where(
            `m.moduleState = true and c.categoryState=true and r.roleState=true and r.id = :idrole ${ user.roles.length > 0 ? 'OR r.id IN (:roles)' : '' }`,
            { idrole: user.userRole.id, roles: user.roles.map((r) => r.id).join(', ') },
          )
          .orderBy('c.categoryOrder, m.moduleOrder', 'ASC')
          .getMany();
        return {
          success: true,
          data,
        };
      } else {
        return {
          success: false,
          code: 'CD001',
        };
      }
    } catch (error) {
      console.error(error)
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async getUserByRoleName(roleName: string) {
    try {
      const role = await this.repositoryRoles.findOne({
        where: {
          roleName: roleName,
        },
      });
      if (!role) {
        throw new Error('Role not found');
      }
      // const currentUser = await this.repositoryUsers.createQueryBuilder()
      //   .select('users')
      //   .from(Users, 'users')
      //   .where('users.id_role = :roleId', {roleId: role.id})
      //   .getOne();

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
        data: plainToInstance(Users, currentUser),
      };
    } catch (error) {
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
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async getDisciplined() {
    try {
      // let mockedResponse = {
      //   empleado:
      //     '{"codigo":"04518","cedula":"31920470","nombre":"NANCY","primerApellido":"LOPEZ","segundoApellido":"BOTERO","planilla":"44","gradoNombre":"PROFESIONAL ADMINISTRATIVO I","fechaIngreso":"1989-04-03","tipoVinculacion":"OFICIAL","tipoContrato":"TERMINO INDEFINIDO","sueldoMensual":1.0952E7,"direccionResid":"CALLE 30 NO.1-25 CASA 33","ciudadResid":"CALI","codCiudadResid":1,"codDptoResid":76,"nombreDptoResid":"VALLE","telefonos":"5191412","email":"nalopez@emcali.com.co","codSociedad":7,"nombreSociedad":"EMCALI EICE  ESP","codConvencion":2,"nombreConvencion":"SINDICATO USE","codEmpresa":1,"codEstDos":777,"codEstTres":0,"codEstCuatro":10,"codEstCinco":2,"codEstSeis":0,"codCentroCostos":"20771100323500","periodosVacacionales":[],"acumuladosPagados":[]}',
      //   resultado: 'ok',
      //   mensaje: 'ok',
      // };
      // const { data } = await firstValueFrom(
      //   this.httpService
      //     .get<DisciplinedDto>(
      //       'http://172.18.30.43/emcali-serviciosrh-ws-v72/emcali/intranet/beca-get-empleado-independiente',
      //     )
      //     .pipe(
      //       catchError((error: AxiosError) => {
      //         // data = mockedResponse;
      //         console.log(error.response.data);
      //         throw 'An error happened!';
      //       }),
      //     ),
      // );
      // console.log(data);

      const disciplined: RequestDisciplined[] =
        await this.repositoryDisciplined.find();
      return {
        success: true,
        data: disciplined,
      };
    } catch (err) {
      return {
        success: false,
        message: err.message,
      };
    }
  }
}
