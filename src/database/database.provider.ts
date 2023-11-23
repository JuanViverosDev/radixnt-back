import { DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';

export const DatabaseProvider: DynamicModule = TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  async useFactory(config: ConfigService) {
    const dbConfig = {
      type: 'postgres',
      host: config.get('POSTGRES_HOST'),
      username: config.get('POSTGRES_USER'),
      password: config.get('POSTGRES_PASSWORD'),
      port: config.get('POSTGRES_PORT'),
      database: config.get('POSTGRES_DATABASE'),
      autoLoadEntities: true,
      ssl: false,
    } as DataSourceOptions;

    return dbConfig;
  },
});
