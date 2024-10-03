import { Module } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { SubjectController } from './subject.controller';
import { CommonService } from 'src/common/services/common.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Subjects, SubjectsSchema } from './schemas/subject.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Subjects.name, schema: SubjectsSchema }]),
  ],
  providers: [SubjectService,CommonService],
  controllers: [SubjectController],
  exports: [SubjectService,CommonService],
})
export class SubjectModule {}
