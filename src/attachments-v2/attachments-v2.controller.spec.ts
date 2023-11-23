import { Test, TestingModule } from '@nestjs/testing';
import { AttachmentsV2Controller } from './attachments-v2.controller';

describe('AttachmentsV2Controller', () => {
  let controller: AttachmentsV2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttachmentsV2Controller],
    }).compile();

    controller = module.get<AttachmentsV2Controller>(AttachmentsV2Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
