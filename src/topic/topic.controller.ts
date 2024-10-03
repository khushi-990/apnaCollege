import { Body, Controller, Get, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { TopicService } from './topic.service';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { RESPONSE_SUCCESS } from 'src/common/constants/response.constant';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTopicDto } from './dto/create-topic.dto';
import { DetailsBasedOnIdDto, PaginationDto } from 'src/common/dto/common.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserTypeEnum } from 'src/users/enum/User.enum';

@Controller('admin/topic')
@Roles(UserTypeEnum.Admin)
@ApiTags("Admin/Topic Management")
@ApiBearerAuth()

export class TopicController {
    constructor(private readonly topicService: TopicService) { }

    @Post("admin/create")
    @ResponseMessage(RESPONSE_SUCCESS.SUBJECT_INSERTED)
    @ApiOperation({
        description: `
    This API will be used for creating new Topic using the admin panel.`,
    })
    create(@Body() createTopictDto: CreateTopicDto) {
        return this.topicService.create(createTopictDto);
    }

    @Post("/list")
    @ResponseMessage(RESPONSE_SUCCESS.TOPIC_LISTED)
    @ApiOperation({ summary: 'Admin can review all Topic' })
    findAll(@Body() body: PaginationDto) {
        return this.topicService.listTopic(body);
    }

    @Post("/getDetails")
    @ResponseMessage(RESPONSE_SUCCESS.TOPIC_DETAILED)
    @ApiOperation({ summary: 'Admin can get details of Topic' })
    getDetailsProduct(@Body() body: DetailsBasedOnIdDto) {
        return this.topicService.findOne(body._id);
    }

    @Patch("update/:id")
    @ResponseMessage(RESPONSE_SUCCESS.TOPIC_UPDATED)
    @ApiOperation({ summary: 'Admin can Update details of Topic' })
    @UsePipes(new ValidationPipe({ transform: true }))
    update(@Param("id") id: string, @Body() updateTopicDto: UpdateTopicDto) {
        return this.topicService.update(id, updateTopicDto);
    }
    

}
