import { Test, TestingModule } from '@nestjs/testing';
import { AttachmentsV2Service } from './attachments-v2.service';

describe('AttachmentsV2Service', () => {
  let service: AttachmentsV2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttachmentsV2Service],
    }).compile();

    service = module.get<AttachmentsV2Service>(AttachmentsV2Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
