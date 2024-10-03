import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
} from "class-validator";
export class UpdateProblemDto {
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
    @IsString()
    level: string;
  
    @ApiProperty()
    @Optional()
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