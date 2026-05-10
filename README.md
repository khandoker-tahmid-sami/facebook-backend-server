# Facebook Backend Server

A REST API backend for a Facebook-like social app built with Node.js and Express.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** JSON file (lowdb via json-server)
- **Auth:** JWT (access + refresh tokens)
- **Email:** Nodemailer
- **File Uploads:** Multer

## Setup

```bash
npm install
```

Create a `.env` file in the root:

```env
SECRET_KEY=your_jwt_secret
REFRESH_SECRET_KEY=your_refresh_secret
CLIENT_URL=http://localhost:5173
GMAIL_USER=your_gmail
GMAIL_APP_PASSWORD=your_gmail_app_password
```

```bash
npm run dev
```

Server runs on `http://localhost:3000`

## API Endpoints

### Auth

| Method | Endpoint                | Description               |
| ------ | ----------------------- | ------------------------- |
| POST   | `/auth/register`        | Register a new user       |
| POST   | `/auth/login`           | Login                     |
| POST   | `/auth/refresh-token`   | Refresh access token      |
| POST   | `/auth/forgot-password` | Send password reset email |
| POST   | `/auth/reset-password`  | Reset password with token |

### Posts

| Method | Endpoint                            | Description          |
| ------ | ----------------------------------- | -------------------- |
| GET    | `/posts`                            | Get all posts        |
| POST   | `/posts`                            | Create a post        |
| GET    | `/posts/:postId`                    | Get a single post    |
| PATCH  | `/posts/:postId`                    | Update a post        |
| DELETE | `/posts/:postId`                    | Delete a post        |
| PATCH  | `/posts/:postId/like`               | Like / Unlike a post |
| PATCH  | `/posts/:postId/comment`            | Add a comment        |
| PATCH  | `/posts/:postId/comment/:commentId` | Edit a comment       |
| DELETE | `/posts/:postId/comment/:commentId` | Delete a comment     |

### Profile

| Method | Endpoint                  | Description      |
| ------ | ------------------------- | ---------------- |
| GET    | `/profile/:userId`        | Get user profile |
| PATCH  | `/profile/:userId`        | Update profile   |
| POST   | `/profile/:userId/avatar` | Upload avatar    |

## Auth

All endpoints except `/auth/*` require a Bearer token in the header:

```
Authorization: Bearer <access_token>
```
