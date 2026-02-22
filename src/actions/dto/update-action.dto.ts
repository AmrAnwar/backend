import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { RepetitionType } from '../../common/enums/repetition-type.enum';
import { ActionStatus } from '../../common/enums/action-status.enum';
import { IsFutureDate } from '../../common/validators/is-future-date.validator';

export class UpdateActionDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(RepetitionType)
  @IsOptional()
  repetitionType?: RepetitionType;

  @IsEnum(ActionStatus)
  @IsOptional()
  status?: ActionStatus;

  @IsDateString()
  @IsOptional()
  @IsFutureDate({ message: 'Deadline must be in the future' })
  deadlineAt?: string;
}
