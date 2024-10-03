import { Module } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { ChapterController } from './chapter.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Chapters, ChaptersSchema } from './schemas/chapter.schema';
import { CommonService } from 'src/common/services/common.service';
import { Promblems, PromblemsSchema } from 'src/problem/schemas/problem.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Promblems.name, schema: PromblemsSchema },{ name: Chapters.name, schema: ChaptersSchema }]),
  ],
  controllers: [ChapterController],
  providers: [ChapterService,CommonService],
  exports: [ChapterService]
})
export class ChapterModule {}
