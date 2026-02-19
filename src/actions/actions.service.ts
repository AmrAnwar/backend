import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { ActionStatus } from '../common/enums/action-status.enum';
import { RepetitionType } from '../common/enums/repetition-type.enum';

@Injectable()
export class ActionsService {
  constructor(private firebaseService: FirebaseService) {}

  private calculateNextDueAt(repetitionType: RepetitionType): string {
    const now = new Date();
    switch (repetitionType) {
      case RepetitionType.DAILY:
        return now.toISOString();
      case RepetitionType.WEEKLY:
        return now.toISOString();
      case RepetitionType.MONTHLY:
        return now.toISOString();
      case RepetitionType.ONCE:
      default:
        return now.toISOString();
    }
  }

  private getNextDueAfterCompletion(
    repetitionType: RepetitionType,
  ): string | null {
    const now = new Date();
    switch (repetitionType) {
      case RepetitionType.DAILY:
        now.setDate(now.getDate() + 1);
        now.setHours(0, 0, 0, 0);
        return now.toISOString();
      case RepetitionType.WEEKLY:
        now.setDate(now.getDate() + 7);
        now.setHours(0, 0, 0, 0);
        return now.toISOString();
      case RepetitionType.MONTHLY:
        now.setMonth(now.getMonth() + 1);
        now.setHours(0, 0, 0, 0);
        return now.toISOString();
      case RepetitionType.ONCE:
      default:
        return null;
    }
  }

  async create(
    userId: string,
    goalId: string,
    createActionDto: CreateActionDto,
  ) {
    const firestore = this.firebaseService.getFirestore();

    // Verify goal exists and belongs to user
    const goalDoc = await firestore.collection('goals').doc(goalId).get();
    const goalData = goalDoc.data();
    if (!goalDoc.exists || !goalData || goalData.userId !== userId) {
      throw new NotFoundException('Goal not found');
    }

    const actionRef = firestore.collection('actions').doc();

    const action = {
      actionId: actionRef.id,
      userId,
      goalId,
      name: createActionDto.name,
      repetitionType: createActionDto.repetitionType,
      status: ActionStatus.IN_PROGRESS,
      createdAt: new Date().toISOString(),
      nextDueAt: this.calculateNextDueAt(createActionDto.repetitionType),
    };

    await actionRef.set(action);

    const { userId: _userId, ...actionWithoutUserId } = action;
    return actionWithoutUserId;
  }

  async findAllByUser(userId: string) {
    const firestore = this.firebaseService.getFirestore();
    const actionsSnapshot = await firestore
      .collection('actions')
      .where('userId', '==', userId)
      .get();

    return actionsSnapshot.docs.map((doc) => {
      const { userId: _userId, ...actionWithoutUserId } = doc.data();
      return actionWithoutUserId;
    });
  }

  async findAllByGoal(userId: string, goalId: string) {
    const firestore = this.firebaseService.getFirestore();

    // Verify goal exists and belongs to user
    const goalDoc = await firestore.collection('goals').doc(goalId).get();
    const goalData = goalDoc.data();
    if (!goalDoc.exists || !goalData || goalData.userId !== userId) {
      throw new NotFoundException('Goal not found');
    }

    const actionsSnapshot = await firestore
      .collection('actions')
      .where('userId', '==', userId)
      .where('goalId', '==', goalId)
      .get();

    return actionsSnapshot.docs.map((doc) => {
      const { userId: _userId, ...actionWithoutUserId } = doc.data();
      return actionWithoutUserId;
    });
  }

  async findOne(userId: string, actionId: string) {
    const firestore = this.firebaseService.getFirestore();
    const actionDoc = await firestore.collection('actions').doc(actionId).get();

    if (!actionDoc.exists) {
      throw new NotFoundException('Action not found');
    }

    const action = actionDoc.data();
    if (!action || action.userId !== userId) {
      throw new NotFoundException('Action not found');
    }

    const { userId: _userId, ...actionWithoutUserId } = action;
    return actionWithoutUserId;
  }

  async update(
    userId: string,
    actionId: string,
    updateActionDto: UpdateActionDto,
  ) {
    const firestore = this.firebaseService.getFirestore();
    const actionDoc = await firestore.collection('actions').doc(actionId).get();

    if (!actionDoc.exists) {
      throw new NotFoundException('Action not found');
    }

    const action = actionDoc.data();
    if (!action || action.userId !== userId) {
      throw new NotFoundException('Action not found');
    }

    const actionRef = firestore.collection('actions').doc(actionId);
    const updates: Record<string, any> = {};

    // Only include fields that are provided in the update
    if (updateActionDto.name !== undefined) {
      updates.name = updateActionDto.name;
    }
    if (updateActionDto.repetitionType !== undefined) {
      updates.repetitionType = updateActionDto.repetitionType;
    }
    if (updateActionDto.deadlineAt !== undefined) {
      updates.deadlineAt = updateActionDto.deadlineAt;
    }

    if (updateActionDto.status !== undefined) {
      updates.status = updateActionDto.status;
    }

    // Only update if there are changes
    if (Object.keys(updates).length > 0) {
      await actionRef.update(updates);
    }

    const updatedAction = await actionRef.get();
    const { userId: _userId, ...actionWithoutUserId } = updatedAction.data()!;
    return actionWithoutUserId;
  }

  async remove(userId: string, actionId: string) {
    const firestore = this.firebaseService.getFirestore();
    const actionDoc = await firestore.collection('actions').doc(actionId).get();

    if (!actionDoc.exists) {
      throw new NotFoundException('Action not found');
    }

    const action = actionDoc.data();
    if (!action || action.userId !== userId) {
      throw new NotFoundException('Action not found');
    }

    await firestore.collection('actions').doc(actionId).delete();

    return { message: 'Action deleted successfully' };
  }
}
