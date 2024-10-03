import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { SubjectModule } from 'src/subject/subject.module';
import { TopicModule } from 'src/topic/topic.module';
import { ChapterModule } from 'src/chapter/chapter.module';
import { UsersModule } from 'src/users/users.module';
import { ProblemModule } from 'src/problem/problem.module';

@Module({
  imports: [
    SubjectModule,
    TopicModule,
    ChapterModule,
    UsersModule,
    ProblemModule
    // MongooseModule.forFeature([{ name: Promblems.name, schema: PromblemsSchema },{ name: Chapters.name, schema: ChaptersSchema }]),
  ],
  providers: [StudentService],
  controllers: [StudentController]
})
export class StudentModule {}
