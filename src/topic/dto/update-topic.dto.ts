import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
} from "class-validator";
export class UpdateTopicDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}
