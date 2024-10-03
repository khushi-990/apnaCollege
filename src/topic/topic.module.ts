import { Module } from '@nestjs/common';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { CommonService } from 'src/common/services/common.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Topics, TopicsSchema } from './schemas/topic.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Topics.name, schema: TopicsSchema }]),
  ],
  controllers: [TopicController],
  providers: [TopicService,CommonService],
  exports: [TopicService],
})
export class TopicModule {}
