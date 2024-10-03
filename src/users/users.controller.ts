import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { RESPONSE_SUCCESS } from "../common/constants/response.constant";
import { ResponseMessage } from "../common/decorators/response.decorator";
import { Public } from "../security/auth/auth.decorator";
import { Roles } from "src/common/decorators/roles.decorator";
import { UserTypeEnum } from "./enum/User.enum";

@Controller("admin/users")
@Roles(UserTypeEnum.Admin)
@ApiTags("Admin/User Management")
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Get("getAll")
  @ResponseMessage(RESPONSE_SUCCESS.USER_LISTED)
  findAll() {
    return this.usersService.findAll();
  }

  @Get("get/:id")
  @ResponseMessage(RESPONSE_SUCCESS.USER_LISTED)
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Patch("update/:id")
  @ResponseMessage(RESPONSE_SUCCESS.USER_UPDATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete("delete/:id")
  @ResponseMessage(RESPONSE_SUCCESS.USER_DELETED)
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}
