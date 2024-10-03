import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { LevelEnum } from "src/problem/enum/Level.enum";

export class CompletedProgramDto {
  @ApiProperty()
  @IsNotEmpty()
  programId: string;
}

export class ProblemPaginationDto {
  @ApiProperty()
  @IsNotEmpty()
  chapterId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  page: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  limit: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  search: string;

  @ApiProperty({ required: false, enum: ["asc", "asc"] })
  @IsOptional()
  @IsString()
  sort_order: "asc" | "asc";

  @ApiProperty()
  @IsOptional()
  @IsString()
  sort_by: string;
}

export class ProblemListAllDto {
  @ApiProperty({
    type: [String],
    description: 'An array of chapter IDs',
    example: ['chapter1', 'chapter2']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  chapterId: string[];

  @ApiProperty({
    type: [String],
    description: 'An array of chapter IDs',
    example: ['chapter1', 'chapter2']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  topicId: string[];

  @ApiProperty({
    type: [String],
    description: 'An array of chapter IDs',
    example: ['chapter1', 'chapter2']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subjectId: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  page: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  limit: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  search: string;

  @ApiProperty({ required: false, enum: ["asc", "asc"] })
  @IsOptional()
  @IsString()
  sort_order: "asc" | "asc";

  @ApiProperty()
  @IsOptional()
  @IsString()
  sort_by: string;

  @ApiProperty({
    type: [String],
    description: 'An array of levels',
    example: ['Easy', 'Medium', 'Tough'],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(LevelEnum, { each: true, message: 'Level must be either Easy, Medium, or Tough' }) // Validate that each element is a valid enum value
  level: LevelEnum[];
}