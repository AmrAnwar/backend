import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as path from 'path';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firestore: admin.firestore.Firestore;

  onModuleInit() {
    if (!admin.apps.length) {
      const serviceAccountPath = path.join(
        process.cwd(),
        'firebase',
        'firebase-adminsdk.json',
      );
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
      });
    }
    this.firestore = admin.firestore();
  }

  getFirestore(): admin.firestore.Firestore {
    return this.firestore;
  }

  getAuth(): admin.auth.Auth {
    return admin.auth();
  }
}
