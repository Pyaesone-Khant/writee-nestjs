import { Test, TestingModule } from '@nestjs/testing';
import { SavedblogsController } from './savedblogs.controller';
import { SavedblogsService } from './savedblogs.service';

describe('SavedblogsController', () => {
  let controller: SavedblogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SavedblogsController],
      providers: [SavedblogsService],
    }).compile();

    controller = module.get<SavedblogsController>(SavedblogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
