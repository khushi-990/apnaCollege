import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "../../common/dto/common.dto";
import { LoggerService } from "../../common/logger/logger.service";
import { UsersService } from "../../users/users.service";
import { JwtPayload } from "../../common//interfaces/jwt.interface";
import { CreateUserDto } from "src/users/dto/create-user.dto";

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private myLogger: LoggerService,
  ) {
    this.myLogger.setContext(AuthService.name);
  }

  /**
   * This function is used for login into user
   * @param params 
   * @returns 
   */
  async login(params: LoginDto) {
    const user = await this.userService.login(params);
    const accessToken = await this.generateAuthToken(user);
    user["accessToken"] = accessToken;
    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      accessToken: accessToken,
    };
  }

  /**
   * This function is used for generate authToken used JWT stritigy for that
   * @param user 
   * @returns 
   */

  async generateAuthToken(user) {
    const payload: JwtPayload = {
      _id: user._id,
      email: user.email,
      userType: user.userType
    };
    return this.jwtService.sign(payload);
  }

  /**
   * This function is user for student registration process
   * @param params 
   * @returns 
   */

  async signUp(params: CreateUserDto) {
    console.log("🚀 ~ AuthService ~ signUp ~ params:", params)
    const user = await this.userService.create(params);
    const accessToken = await this.generateAuthToken(user);
    user["accessToken"] = accessToken;
    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      accessToken: accessToken,
    };
  }
}
