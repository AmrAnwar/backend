import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../auth/user.decorator';

@Controller('goals')
@UseGuards(AuthGuard)
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  create(
    @User('uid') userId: string,
    @Body(ValidationPipe) createGoalDto: CreateGoalDto,
  ) {
    return this.goalsService.create(userId, createGoalDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@User('uid') userId: string) {
    return this.goalsService.findAll(userId);
  }

  @Get(':id')
  findOne(@User('uid') userId: string, @Param('id') id: string) {
    return this.goalsService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @User('uid') userId: string,
    @Param('id') id: string,
    @Body(ValidationPipe) updateGoalDto: UpdateGoalDto,
  ) {
    return this.goalsService.update(userId, id, updateGoalDto);
  }

  @Delete(':id')
  remove(@User('uid') userId: string, @Param('id') id: string) {
    return this.goalsService.remove(userId, id);
  }
}
