import { Module } from '@nestjs/common';
import { ProblemService } from './problem.service';
import { ProblemController } from './problem.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Promblems, PromblemsSchema } from './schemas/problem.schema';
import { CommonService } from 'src/common/services/common.service';
import { Chapters, ChaptersSchema } from 'src/chapter/schemas/chapter.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: Promblems.name, schema: PromblemsSchema },{ name: Chapters.name, schema: ChaptersSchema }]),
  ],
  providers: [ProblemService,CommonService],
  controllers: [ProblemController],
  exports: [ProblemService]
})
export class ProblemModule {}
