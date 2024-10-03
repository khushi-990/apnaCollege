import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsNotEmpty,
  IsString,
} from "class-validator";
import { LevelEnum } from "../enum/Level.enum";

export class CreateProblemDto {

  @ApiProperty()
  @IsNotEmpty()
  chapterId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @Optional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(LevelEnum, { message: 'Level must be either Easy or Medium or Tough' })
  @IsString()
  level: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  leetcodeorCodeforceLink: string;

  @ApiProperty()
  @Optional()
  @IsString()
  youtubeLink: string;

  @ApiProperty()
  @Optional()
  @IsString()
  articleLink: string;

}
