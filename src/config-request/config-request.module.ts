import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigRequestController } from './config-request.controller';
import { ConfigRequestService } from './config-request.service';
import { Lawyers } from './entities/lawyers.entity';
import { TypeFile } from './entities/typeFile.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([TypeFile, Lawyers]),
  ],
  controllers: [ConfigRequestController],
  providers: [ConfigRequestService]
})
export class ConfigRequestModule {}
