import { Test, TestingModule } from '@nestjs/testing';
import { SavedblogsService } from './savedblogs.service';

describe('SavedblogsService', () => {
  let service: SavedblogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SavedblogsService],
    }).compile();

    service = module.get<SavedblogsService>(SavedblogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
