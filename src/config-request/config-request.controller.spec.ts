import { Test, TestingModule } from '@nestjs/testing';
import { ConfigRequestController } from './config-request.controller';

describe('ConfigRequestController', () => {
  let controller: ConfigRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfigRequestController],
    }).compile();

    controller = module.get<ConfigRequestController>(ConfigRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
