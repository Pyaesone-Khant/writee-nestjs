import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reaction } from './entities/reaction.entity';
import { ReactionService } from './reaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reaction])],
  providers: [ReactionService],
  exports: [ReactionService]
})
export class ReactionModule { }
