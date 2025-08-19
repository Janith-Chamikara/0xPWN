import { Test, TestingModule } from '@nestjs/testing';
import { WriteupController } from './writeup.controller';

describe('WriteupController', () => {
  let controller: WriteupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WriteupController],
    }).compile();

    controller = module.get<WriteupController>(WriteupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
