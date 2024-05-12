import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { Reaction } from './entities/reaction.entity';

@Injectable()
export class ReactionService {

  constructor(
    @InjectRepository(Reaction) private reactionRepository: Repository<Reaction>
  ) { }

  async create(userId: number, createReactionDto: CreateReactionDto) {
    return await this.reactionRepository.save({
      user: { id: userId },
      blog: { id: createReactionDto.blogId }
    });
  }

  async findAll(blogId: number) {
    return await this.reactionRepository.findOne({ where: { blog: { id: blogId } }, relations: ['user'] })
  }

  async findOne({ blogId, userId }: { blogId: number; userId: number }) {
    return await this.reactionRepository.findOne({ where: { blog: { id: blogId }, user: { id: userId } }, relations: ['user'] })
  }

  async remove({ blogId, userId }: { blogId: number; userId: number }) {
    return await this.reactionRepository.delete({ blog: { id: blogId }, user: { id: userId } })
  }
}
