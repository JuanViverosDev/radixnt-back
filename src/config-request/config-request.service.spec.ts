import { Test, TestingModule } from '@nestjs/testing';
import { ConfigRequestService } from './config-request.service';

describe('ConfigRequestService', () => {
  let service: ConfigRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigRequestService],
    }).compile();

    service = module.get<ConfigRequestService>(ConfigRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
