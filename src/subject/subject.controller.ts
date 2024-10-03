import { Body, Controller,  Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserTypeEnum } from 'src/users/enum/User.enum';
import { SubjectService } from './subject.service';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { RESPONSE_SUCCESS } from 'src/common/constants/response.constant';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { DetailsBasedOnIdDto, PaginationDto } from 'src/common/dto/common.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Controller('admin/subject')
@Roles(UserTypeEnum.Admin)
@ApiTags("Admin/Subject Management")
@ApiBearerAuth()

export class SubjectController {
    constructor(private readonly subjectService: SubjectService) { }

    @Post("create")
    @ResponseMessage(RESPONSE_SUCCESS.SUBJECT_INSERTED)
    @ApiOperation({
        description: `
    This API will be used for creating new subject using the admin panel.`,
    })
    create(@Body() createSubjectDto: CreateSubjectDto) {
        return this.subjectService.create(createSubjectDto);
    }

    @Post("/list")
    @ResponseMessage(RESPONSE_SUCCESS.SUBJECT_LISTED)
    @ApiOperation({ summary: 'Admin can review all Subject' })
    findAll(@Body() body: PaginationDto) {
        return this.subjectService.listSubject(body);
    }

    @Post("/getDetails")
    @ResponseMessage(RESPONSE_SUCCESS.SUBJECT_DETAILED)
    @ApiOperation({ summary: 'Admin can get Details all Subject' })
    getDetailsProduct(@Body() body: DetailsBasedOnIdDto) {
        return this.subjectService.findOne(body._id);
    }

    @Patch("update/:id")
    @ResponseMessage(RESPONSE_SUCCESS.SUBJECT_UPDATED)
    @ApiOperation({ summary: 'Admin can Update Details all Subject' })
    @UsePipes(new ValidationPipe({ transform: true }))
    update(@Param("id") id: string, @Body() updateSubjectDto: UpdateSubjectDto) {
        return this.subjectService.update(id, updateSubjectDto);
    }

}
