import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { CategoryModule } from './entities/catModules.entity';
import { Modules } from './entities/modules.entity';
import { Positions } from './entities/positions.entity';
import { Roles } from './entities/roles.entity';
import { Users } from './entities/users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import {RequestDisciplined} from "../requests/entities/requestDisciplined.entity";
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Users, Positions, Roles, Modules, CategoryModule, RequestDisciplined]),
    forwardRef(() => AuthModule)
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
