import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { Public } from "./auth.decorator";
import { LoginDto } from "../../common/dto/common.dto";
import { ResponseMessage } from "../../common/decorators/response.decorator";
import { RESPONSE_SUCCESS } from "../../common/constants/response.constant";
import { CreateUserDto } from "src/users/dto/create-user.dto";

@Controller("auth")
@ApiTags("Auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ResponseMessage(RESPONSE_SUCCESS.USER_LOGIN)
  @Post("/login")
  async login(@Body() params: LoginDto) {
    return await this.authService.login(params);
  }

  @Public()
  @ResponseMessage(RESPONSE_SUCCESS.USER_SIGNUP)
  @Post("/signUp")
  async signUp(@Body() params: CreateUserDto) {
    return await this.authService.signUp(params);
  }
}
