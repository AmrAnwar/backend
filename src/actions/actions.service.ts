import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { ActionStatus } from '../common/enums/action-status.enum';

@Injectable()
export class ActionsService {
  constructor(private firebaseService: FirebaseService) {}

  async create(
    userId: string,
    goalId: string,
    createActionDto: CreateActionDto,
  ) {
    const firestore = this.firebaseService.getFirestore();

    const goalDoc = await firestore.collection('goals').doc(goalId).get();
    const goalData = goalDoc.data();
    if (!goalDoc.exists || !goalData || goalData.userId !== userId) {
      throw new NotFoundException('Goal not found');
    }

    const actionRef = firestore
      .collection('goals')
      .doc(goalId)
      .collection('actions')
      .doc();

    const action = {
      actionId: actionRef.id,
      goalRef: goalId,
      name: createActionDto.name,
      repetitionType: createActionDto.repetitionType,
      status: ActionStatus.TODO,
      deadlineAt: createActionDto.deadlineAt || null,
      createdAt: new Date().toISOString(),
    };

    await actionRef.set(action);

    return action;
  }

  async findAll(userId: string, goalId: string) {
    const firestore = this.firebaseService.getFirestore();

    const goalDoc = await firestore.collection('goals').doc(goalId).get();
    const goalData = goalDoc.data();
    if (!goalDoc.exists || !goalData || goalData.userId !== userId) {
      throw new NotFoundException('Goal not found');
    }

    const actionsSnapshot = await firestore
      .collection('goals')
      .doc(goalId)
      .collection('actions')
      .get();

    return actionsSnapshot.docs.map((doc) => doc.data());
  }

  async findOne(userId: string, goalId: string, actionId: string) {
    const firestore = this.firebaseService.getFirestore();

    const goalDoc = await firestore.collection('goals').doc(goalId).get();
    const goalData = goalDoc.data();
    if (!goalDoc.exists || !goalData || goalData.userId !== userId) {
      throw new NotFoundException('Goal not found');
    }

    const actionDoc = await firestore
      .collection('goals')
      .doc(goalId)
      .collection('actions')
      .doc(actionId)
      .get();

    if (!actionDoc.exists) {
      throw new NotFoundException('Action not found');
    }

    return actionDoc.data();
  }

  async update(
    userId: string,
    goalId: string,
    actionId: string,
    updateActionDto: UpdateActionDto,
  ) {
    await this.findOne(userId, goalId, actionId);

    const firestore = this.firebaseService.getFirestore();
    const actionRef = firestore
      .collection('goals')
      .doc(goalId)
      .collection('actions')
      .doc(actionId);

    await actionRef.update({ ...updateActionDto });

    const updatedAction = await actionRef.get();
    return updatedAction.data();
  }

  async remove(userId: string, goalId: string, actionId: string) {
    await this.findOne(userId, goalId, actionId);

    const firestore = this.firebaseService.getFirestore();
    await firestore
      .collection('goals')
      .doc(goalId)
      .collection('actions')
      .doc(actionId)
      .delete();

    return { message: 'Action deleted successfully' };
  }
}
