import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { StudentService } from './student.service';
import { SubjectService } from 'src/subject/subject.service';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { RESPONSE_SUCCESS } from 'src/common/constants/response.constant';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto/common.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserTypeEnum } from 'src/users/enum/User.enum';
import { TopicService } from 'src/topic/topic.service';
import { ChapterService } from 'src/chapter/chapter.service';
import { CompletedProgramDto, ProblemListAllDto, ProblemPaginationDto } from './dto/student.dto';
import { ProblemService } from 'src/problem/problem.service';

@Controller('student')
@Roles(UserTypeEnum.User)
@ApiTags("student")
@ApiBearerAuth()

export class StudentController {
    constructor(private readonly studentService: StudentService,
        private readonly subjectService: SubjectService,
        private readonly topicService: TopicService,
        private readonly chapterService: ChapterService,
        private readonly problemService: ProblemService,


    ) { }

    @Post("show-subject-list")
    @ResponseMessage(RESPONSE_SUCCESS.STUDENT_SHOW_SUBJECT)
    @ApiOperation({
        description: `This API will be used for show user to list of Subject in main page.`
    })
    listStudentSubject(@Body() body: PaginationDto) {
        return this.subjectService.listSubject(body)
    }

    @Post("show-topic-list/:id")
    @ResponseMessage(RESPONSE_SUCCESS.STUDENT_SHOW_TOPIC)
    @ApiOperation({
        description: `This API will be used for show user to list of Topic of subject in main page.`
    })
    listStudentTopic(@Param("id") id: string, @Body() body: PaginationDto) {
        return this.topicService.listTopic(body, id)
    }

    @Post("show-chapter-list/:id")
    @ResponseMessage(RESPONSE_SUCCESS.STUDENT_SHOW_CHAPTER)
    @ApiOperation({
        description: `This API will be used for show user to list of Chapter of Topic in main page.`
    })
    listStudentChapter(@Param("id") id: string, @Body() body: PaginationDto) {
        return this.chapterService.listChapter(body, id)
    }

    @Post("mark-problem-as-completed")
    @ResponseMessage(RESPONSE_SUCCESS.STUDENT_COMPLETED_PROGRAM)
    @ApiOperation({
        description: `This API will be used for user clickon checkbox and completed program.`
    })
    markProblemAsCompleted(@Body() body: CompletedProgramDto, @Request() req) {
        return this.studentService.markProblemAsCompleted(body, req.user._id)
    }

    @Post("show-problem-list-based-chapter/:id")
    @ResponseMessage(RESPONSE_SUCCESS.STUDENT_SHOW_CHAPTER)
    @ApiOperation({
        description: `This API will be used for show user to list of problem based on chapter in main page.`
    })
    listStudentProblem(@Body() body: ProblemPaginationDto, @Request() req) {
        return this.problemService.listOfProblemBasedOnChapter(body, req.user._id)
    }

    @Post("show-problem-list")
    @ResponseMessage(RESPONSE_SUCCESS.STUDENT_SHOW_CHAPTER)
    @ApiOperation({
        description: `This API will be used for show user to list problem in main page.`
    })
    listAllStudentProblem(@Body() body: ProblemListAllDto, @Request() req) {
        return this.problemService.listAllStudentProblem(body, req.user._id)
    }

    @Get("/list-all-subject")
    @ResponseMessage(RESPONSE_SUCCESS.SUBJECT_LISTED)
    @ApiOperation({ summary: 'Admin can review all Subject without pagination' })
    findAllSubject() {
        return this.subjectService.findAllSubject();
    }

    @Get("/list-all-topic")
    @ResponseMessage(RESPONSE_SUCCESS.SUBJECT_LISTED)
    @ApiOperation({ summary: 'Admin can review all Topic without pagination' })
    findAllTopic() {
        return this.topicService.findAllTopic();
    }

    @Get("/list-all-chapter")
    @ResponseMessage(RESPONSE_SUCCESS.SUBJECT_LISTED)
    @ApiOperation({ summary: 'Admin can review all chapter without pagination' })
    findAllChapter() {
        return this.chapterService.findAllChapter();
    }

}
