import { Body, Controller, Get, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { RESPONSE_SUCCESS } from 'src/common/constants/response.constant';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { DetailsBasedOnIdDto, PaginationDto } from 'src/common/dto/common.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserTypeEnum } from 'src/users/enum/User.enum';

@Controller('admin/chapter')
@Roles(UserTypeEnum.Admin)
@ApiTags("Admin/Chapter Management")
@ApiBearerAuth()

export class ChapterController {
    constructor(private readonly chapterService: ChapterService) { }

    @Post("create")
    @ResponseMessage(RESPONSE_SUCCESS.CHAPTER_INSERTED)
    @ApiOperation({
        description: `
    This API will be used for creating new Chapter using the admin panel.`,
    })
    create(@Body() createChapterDto: CreateChapterDto) {
        return this.chapterService.create(createChapterDto);
    }

    @Post("/list")
    @ResponseMessage(RESPONSE_SUCCESS.CHAPTER_LISTED)
    @ApiOperation({ summary: 'Admin can review all Chapter' })
    findAll(@Body() body: PaginationDto) {
        return this.chapterService.listChapter(body);
    }

    @Post("/getDetails")
    @ResponseMessage(RESPONSE_SUCCESS.CHAPTER_DETAILED)
    @ApiOperation({ summary: 'Admin can get Details of Chapter' })
    getDetailsProduct(@Body() body: DetailsBasedOnIdDto) {
        return this.chapterService.findOne(body._id);
    }

    @Patch("update/:id")
    @ResponseMessage(RESPONSE_SUCCESS.CHAPTER_UPDATED)
    @UsePipes(new ValidationPipe({ transform: true }))
    @ApiOperation({ summary: 'Admin can update Details of Chapter' })
    update(@Param("id") id: string, @Body() updateChapterDto: UpdateChapterDto) {
        return this.chapterService.update(id, updateChapterDto);
    }

    
}
