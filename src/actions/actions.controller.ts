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
} from '@nestjs/common';
import { ActionsService } from './actions.service';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../auth/user.decorator';

@Controller('goals/:goalId/actions')
@UseGuards(AuthGuard)
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Post()
  create(
    @User('uid') userId: string,
    @Param('goalId') goalId: string,
    @Body(ValidationPipe) createActionDto: CreateActionDto,
  ) {
    return this.actionsService.create(userId, goalId, createActionDto);
  }

  @Get()
  findAll(@User('uid') userId: string, @Param('goalId') goalId: string) {
    return this.actionsService.findAll(userId, goalId);
  }

  @Get(':id')
  findOne(
    @User('uid') userId: string,
    @Param('goalId') goalId: string,
    @Param('id') id: string,
  ) {
    return this.actionsService.findOne(userId, goalId, id);
  }

  @Patch(':id')
  update(
    @User('uid') userId: string,
    @Param('goalId') goalId: string,
    @Param('id') id: string,
    @Body(ValidationPipe) updateActionDto: UpdateActionDto,
  ) {
    return this.actionsService.update(userId, goalId, id, updateActionDto);
  }

  @Delete(':id')
  remove(
    @User('uid') userId: string,
    @Param('goalId') goalId: string,
    @Param('id') id: string,
  ) {
    return this.actionsService.remove(userId, goalId, id);
  }
}
