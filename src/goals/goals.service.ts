import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { GoalStatus } from '../common/enums/goal-status.enum';

@Injectable()
export class GoalsService {
  constructor(private firebaseService: FirebaseService) {}

  async create(userId: string, createGoalDto: CreateGoalDto) {
    const firestore = this.firebaseService.getFirestore();
    const goalRef = firestore.collection('goals').doc();

    const goal = {
      goalId: goalRef.id,
      userId,
      name: createGoalDto.name,
      deadlineAt: createGoalDto.deadlineAt || null,
      createdAt: new Date().toISOString(),
      completedAt: null,
      status: GoalStatus.IN_PROGRESS,
    };

    await goalRef.set(goal);

    return goal;
  }

  async findAll(userId: string) {
    const firestore = this.firebaseService.getFirestore();
    const goalsSnapshot = await firestore
      .collection('goals')
      .where('userId', '==', userId)
      .get();

    return goalsSnapshot.docs.map((doc) => doc.data());
  }

  async findOne(userId: string, goalId: string) {
    const firestore = this.firebaseService.getFirestore();
    const goalDoc = await firestore.collection('goals').doc(goalId).get();

    if (!goalDoc.exists) {
      throw new NotFoundException('Goal not found');
    }

    const goal = goalDoc.data();

    if (!goal || goal.userId !== userId) {
      throw new NotFoundException('Goal not found');
    }

    return goal;
  }

  async update(userId: string, goalId: string, updateGoalDto: UpdateGoalDto) {
    await this.findOne(userId, goalId);

    const firestore = this.firebaseService.getFirestore();
    const goalRef = firestore.collection('goals').doc(goalId);

    const updates: Record<string, any> = { ...updateGoalDto };

    if (
      updateGoalDto.status === GoalStatus.DONE &&
      !('completedAt' in updates)
    ) {
      updates.completedAt = new Date().toISOString();
    }

    await goalRef.update(updates);

    const updatedGoal = await goalRef.get();
    return updatedGoal.data();
  }

  async remove(userId: string, goalId: string) {
    await this.findOne(userId, goalId);

    const firestore = this.firebaseService.getFirestore();
    await firestore.collection('goals').doc(goalId).delete();

    return { message: 'Goal deleted successfully' };
  }
}
