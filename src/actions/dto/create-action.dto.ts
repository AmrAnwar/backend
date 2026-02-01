import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { RepetitionType } from '../../common/enums/repetition-type.enum';

export class CreateActionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(RepetitionType)
  repetitionType: RepetitionType;

  @IsDateString()
  @IsOptional()
  deadlineAt?: string;
}
