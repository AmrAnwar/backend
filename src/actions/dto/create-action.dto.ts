import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { RepetitionType } from '../../common/enums/repetition-type.enum';
import { IsFutureDate } from '../../common/validators/is-future-date.validator';

export class CreateActionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(RepetitionType)
  repetitionType: RepetitionType;

  @IsDateString()
  @IsOptional()
  @IsFutureDate({ message: 'Deadline must be in the future' })
  deadlineAt?: string;
}
