import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  ValidateIf,
  IsDateString,
  IsString,
  IsNumber,
  IsOptional,
} from "class-validator";

export class LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class DateRangeDto {
  @ApiProperty({ type: Date, format: "date" })
  @ValidateIf((r) => r.endDate)
  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @ApiProperty({ type: Date, format: "date" })
  @ValidateIf((r) => r.startDate)
  @IsNotEmpty()
  @IsDateString()
  endDate: string;
}

export class UserIdDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  _id: string;
}

export class PaginationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  page: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  limit: number;

  @ApiProperty({example:"abc",description:"if not then remove this field during pass req"})
  @IsOptional()
  @IsString()
  search: string;

  @ApiProperty({ required: false, enum: ["asc", "asc"] })
  @IsOptional()
  @IsString()
  sort_order: "asc" | "asc";

  @ApiProperty({example: "fieldName", description:"if not then remove this field during pass req"})
  @IsOptional()
  @IsString()
  sort_by: string;
}

export class DetailsBasedOnIdDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  _id: string;
}
