import { Body, Controller, Param, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserTypeEnum } from 'src/users/enum/User.enum';
import { ProblemService } from './problem.service';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { RESPONSE_SUCCESS } from 'src/common/constants/response.constant';
import { CreateProblemDto } from './dto/create-problem.dto';
import { DetailsBasedOnIdDto, PaginationDto } from 'src/common/dto/common.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';

@Controller('admin/problem')
@Roles(UserTypeEnum.Admin)
@ApiTags("Admin/Problem Management")
@ApiBearerAuth()

export class ProblemController {
    constructor(private readonly problemService: ProblemService) { }

    @Post("create")
    @ResponseMessage(RESPONSE_SUCCESS.PROBLEM_INSERTED)
    @ApiOperation({
        description: `
    This API will be used for creating new Problem using the admin panel.`,
    })
    create(@Body() createProblemDto: CreateProblemDto) {
        return this.problemService.create(createProblemDto);
    }
   
    @Post("/list")
    @ResponseMessage(RESPONSE_SUCCESS.PROBLEM_LISTED)
    @ApiOperation({ summary: 'Admin can review all Problem' })
    findAll(@Body() body: PaginationDto) {
        return this.problemService.listProblem(body);
    }

    @Post("/getDetails")
    @ResponseMessage(RESPONSE_SUCCESS.PROBLEM_LISTED)
    @ApiOperation({ summary: 'Admin can get details of Problem' })
    getDetailsProduct(@Body() body: DetailsBasedOnIdDto) {
        return this.problemService.findOne(body._id);
    }

    @Patch("update/:id")
    @ResponseMessage(RESPONSE_SUCCESS.PROBLEM_UPDATED)
    @ApiOperation({ summary: 'Admin can update details of Problem' })
    @UsePipes(new ValidationPipe({ transform: true }))
    update(@Param("id") id: string, @Body() updateProblemDto: UpdateProblemDto) {
        return this.problemService.update(id, updateProblemDto);
    }

}
