# Green House Backend

A NestJS backend for the Green House planning application with Firebase Authentication and Firestore database.

## Features

- Firebase Authentication integration
- Firestore database for goals and actions
- RESTful API endpoints
- Automatic validation and error handling
- CORS enabled for web/mobile clients

## Database Structure

### Goals Collection
- `goalId`: Unique identifier
- `userId`: User who owns the goal
- `name`: Goal name
- `createdAt`: Creation timestamp
- `deadlineAt`: Optional deadline
- `completedAt`: Completion timestamp
- `status`: IN_PROGRESS | DONE

### Actions Subcollection (under each goal)
- `actionId`: Unique identifier
- `goalRef`: Reference to parent goal
- `name`: Action name
- `repetitionType`: ONCE | DAILY | WEEKLY | MONTHLY
- `status`: TODO | IN_PROGRESS | DONE
- `createdAt`: Creation timestamp
- `deadlineAt`: Optional deadline

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Firestore Database
4. Enable Authentication (Email/Password, Google, etc.)
5. Go to Project Settings > Service Accounts
6. Click "Generate New Private Key"
7. Save the JSON file securely

### 3. Environment Configuration

1. Copy `.env.example` to `.env`
2. Set `GOOGLE_APPLICATION_CREDENTIALS` to the path of your Firebase service account JSON file

```bash
cp .env.example .env
```

### 4. Run the Application

Development mode:
```bash
npm run start:dev
```

Production mode:
```bash
npm run build
npm run start:prod
```

The server will start on `http://localhost:3000` (or the PORT specified in .env)

## API Endpoints

All endpoints require Firebase Authentication token in the Authorization header:
```
Authorization: Bearer <firebase-id-token>
```

### Goals

- `POST /goals` - Create a new goal
- `GET /goals` - Get all goals for authenticated user
- `GET /goals/:id` - Get a specific goal
- `PATCH /goals/:id` - Update a goal
- `DELETE /goals/:id` - Delete a goal

### Actions

- `POST /goals/:goalId/actions` - Create a new action
- `GET /goals/:goalId/actions` - Get all actions for a goal
- `GET /goals/:goalId/actions/:id` - Get a specific action
- `PATCH /goals/:goalId/actions/:id` - Update an action
- `DELETE /goals/:goalId/actions/:id` - Delete an action

## Example API Calls

### Create a Goal
```bash
curl -X POST http://localhost:3000/goals \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Learn NestJS",
    "deadlineAt": "2026-03-01T00:00:00Z"
  }'
```

### Create an Action
```bash
curl -X POST http://localhost:3000/goals/GOAL_ID/actions \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Complete tutorial",
    "repetitionType": "ONCE",
    "deadlineAt": "2026-02-15T00:00:00Z"
  }'
```

### Get All Goals
```bash
curl -X GET http://localhost:3000/goals \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

## Client Integration

### Web/Mobile Apps

Your web or mobile apps should:

1. Use Firebase SDK to authenticate users
2. Get the ID token from Firebase Auth
3. Send the token in the Authorization header with each API request

Example (JavaScript):
```javascript
import { getAuth } from 'firebase/auth';

const auth = getAuth();
const user = auth.currentUser;

if (user) {
  const token = await user.getIdToken();

  const response = await fetch('http://localhost:3000/goals', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
}
```

## Security Notes

- Never commit your Firebase service account JSON file
- Keep your `.env` file secure and never commit it
- The backend validates all Firebase tokens before processing requests
- Users can only access their own goals and actions

## Development

Run tests:
```bash
npm test
```

Run linter:
```bash
npm run lint
```

Format code:
```bash
npm run format
```
