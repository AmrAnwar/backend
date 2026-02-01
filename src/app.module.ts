import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase/firebase.module';
import { GoalsModule } from './goals/goals.module';
import { ActionsModule } from './actions/actions.module';

@Module({
  imports: [FirebaseModule, GoalsModule, ActionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
