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

@Controller()
@UseGuards(AuthGuard)
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  // Get all actions for the current user
  @Get('actions')
  findAllByUser(@User('uid') userId: string) {
    return this.actionsService.findAllByUser(userId);
  }

  // Get single action by ID
  @Get('actions/:id')
  findOne(@User('uid') userId: string, @Param('id') id: string) {
    return this.actionsService.findOne(userId, id);
  }

  // Update action
  @Patch('actions/:id')
  update(
    @User('uid') userId: string,
    @Param('id') id: string,
    @Body(ValidationPipe) updateActionDto: UpdateActionDto,
  ) {
    return this.actionsService.update(userId, id, updateActionDto);
  }

  // Delete action
  @Delete('actions/:id')
  remove(@User('uid') userId: string, @Param('id') id: string) {
    return this.actionsService.remove(userId, id);
  }

  // Create action for a goal
  @Post('goals/:goalId/actions')
  create(
    @User('uid') userId: string,
    @Param('goalId') goalId: string,
    @Body(ValidationPipe) createActionDto: CreateActionDto,
  ) {
    return this.actionsService.create(userId, goalId, createActionDto);
  }

  // Get all actions for a specific goal
  @Get('goals/:goalId/actions')
  findAllByGoal(@User('uid') userId: string, @Param('goalId') goalId: string) {
    return this.actionsService.findAllByGoal(userId, goalId);
  }
}
