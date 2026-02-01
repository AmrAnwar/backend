import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { RepetitionType } from '../../common/enums/repetition-type.enum';
import { ActionStatus } from '../../common/enums/action-status.enum';

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
  deadlineAt?: string;
}
