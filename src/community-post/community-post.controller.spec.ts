import { Test, TestingModule } from '@nestjs/testing';
import { CommunityPostController } from './community-post.controller';

describe('CommunityPostController', () => {
  let controller: CommunityPostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommunityPostController],
    }).compile();

    controller = module.get<CommunityPostController>(CommunityPostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
