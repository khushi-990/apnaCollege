import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import * as bcrypt from "bcrypt";
import { Model } from "mongoose";
import { LoginDto } from "../common/dto/common.dto";
import { AuthExceptions, TypeExceptions } from "../common/helpers/exceptions";
import { LoggerService } from "../common/logger/logger.service";
import { Users, UsersDocument } from "../users/schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { RESPONSE_ERROR } from "../common/constants/response.constant";
import { EncryptPasswordService } from "src/services/encrypt.service";
import { GenderEnum } from "./enum/User.enum";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private userModel: Model<UsersDocument>,
    private myLogger: LoggerService,
    private configService: ConfigService,
    private encryptPasswordService: EncryptPasswordService
  ) {
    // Due to transient scope, UsersService has its own unique instance of MyLogger,
    // so setting context here will not affect other instances in other services
    this.myLogger.setContext(UsersService.name);
  }

  async create(createUserDto: CreateUserDto) {
    // Check duplicate user
    if (await this.getUserByEmail(createUserDto.email)) {
      throw TypeExceptions.AlreadyExistsCommonFunction(
        RESPONSE_ERROR.USER_ALREADY_EXIST,
      );
    }
    const password = await this.encryptPasswordService.encryptPassword(createUserDto.password)
    const gender = GenderEnum[createUserDto.gender]
    console.log("🚀 ~ UsersService ~ create ~ gender:", gender)
    return await this.userModel.create({ ...createUserDto, password,gender });
  }

  async findAll() {
    return await this.userModel.find();
  }

  async findOne(userId: string) {
    return await this.userModel.findOne({
      _id: userId,
    });
  }

  async findOneSelectedField(userId: string) {
    return await this.userModel.findById(userId).select('completedProblems -_id').exec();
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    return await this.userModel.findOneAndUpdate(
      { _id: userId },
      updateUserDto,
    );
  }

  async remove(userId: string) {
    return await this.userModel.deleteOne({ _id: userId });
  }

  async createInitialUser(): Promise<void> {
    const user = await this.getUserByEmail(
      this.configService.get("database.initialUser.email"),
    );

    if (user) {
      this.myLogger.customLog("Initial user already loaded.");
    } else {
      const params: CreateUserDto = {
        firstName: this.configService.get("database.initialUser.firstName"),
        lastName: this.configService.get("database.initialUser.lastName"),
        gender: this.configService.get("database.initialUser.gender"),
        email: this.configService.get("database.initialUser.email"),
        password: "",
      };

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(
        this.configService.get("database.initialUser.password"),
        salt,
      );

      params.password = hash;

      await this.userModel.create(params);
      this.myLogger.log("Initial user loaded successfully.");
    }
  }

  async login(params: LoginDto) {
    const user = await this.userModel.findOne({
      email: params.email,
    });

    if (!user) {
      throw AuthExceptions.AccountNotExist();
    }

    if (!user.isActive) {
      throw AuthExceptions.AccountNotActive();
    }

    if (!await this.encryptPasswordService.comparePassword(params.password, user.password)) {
      throw AuthExceptions.InvalidPassword();
    }

    delete user.password;
    delete user.__v;

    return user;
  }

  async getUserByEmail(email: string) {
    // console.log("🚀 ~ UsersService ~ getUserByEmail ~ email:", email)
    return await this.userModel.findOne({
      email: email,
    });
  }
}
