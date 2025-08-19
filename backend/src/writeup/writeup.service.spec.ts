import { Test, TestingModule } from '@nestjs/testing';
import { WriteupService } from './writeup.service';

describe('WriteupService', () => {
  let service: WriteupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WriteupService],
    }).compile();

    service = module.get<WriteupService>(WriteupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
