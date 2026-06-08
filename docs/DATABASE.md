# Database Schema

## User Model

```prisma
model User {
  id                String   @id @default(cuid())
  email             String   @unique
  username          String   @unique
  password          String
  name              String
  avatar            String?
  bio               String?
  grade             Int      // 9-12
  country           String   // User's country
  isAdmin           Boolean  @default(false)
  emailVerified     Boolean  @default(false)
  isActive          Boolean  @default(true)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  deletedAt         DateTime?
}
```

## Opportunity Model

```prisma
model Opportunity {
  id              String   @id @default(cuid())
  title           String
  description     String   @db.Text
  organization    String
  type            OpportunityType
  category        String?
  isPaid          Boolean
  payAmount       Float?
  locations       String[] // Array of countries
  minGrade        Int?
  maxGrade        Int?
  isScholarship   Boolean  @default(false)
  scholarshipAmount Float?
  deadline        DateTime
  startDate       DateTime?
  endDate         DateTime?
  applicationUrl  String
  imageUrl        String?
  featured        Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  deletedAt       DateTime? // Soft delete after deadline
}

enum OpportunityType {
  INTERNSHIP
  COMPETITION
  OLYMPIAD
  SUMMER_PROGRAM
  RESEARCH
  SCHOLARSHIP
}
```

## SavedOpportunity Model

```prisma
model SavedOpportunity {
  id              String   @id @default(cuid())
  userId          String
  opportunityId   String
  savedAt         DateTime @default(now())
  
  @@unique([userId, opportunityId])
}
```

## FeedPost Model

```prisma
model FeedPost {
  id        String   @id @default(cuid())
  userId    String
  content   String   @db.Text
  images    String[]
  type      String   // "IDEA", "TIP", "OPPORTUNITY_SHARE", "QUESTION"
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?
}
```

## FeedComment Model

```prisma
model FeedComment {
  id        String   @id @default(cuid())
  postId    String
  userId    String
  content   String   @db.Text
  createdAt DateTime @default(now())
}
```

## FeedLike Model

```prisma
model FeedLike {
  id        String   @id @default(cuid())
  postId    String
  userId    String
  createdAt DateTime @default(now())
  
  @@unique([postId, userId])
}
```

## Connection Model

```prisma
model Connection {
  id        String   @id @default(cuid())
  fromId    String
  toId      String
  status    ConnectionStatus @default(PENDING)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@unique([fromId, toId])
}

enum ConnectionStatus {
  PENDING
  ACCEPTED
  BLOCKED
  REJECTED
}
```

## Message Model

```prisma
model Message {
  id          String   @id @default(cuid())
  senderId    String
  receiverId  String
  content     String   @db.Text
  isRead      Boolean  @default(false)
  readAt      DateTime?
  createdAt   DateTime @default(now())
}
```

## Indexes

For optimal performance, the following indexes are created:

- `User`: email, username
- `Opportunity`: type, deadline, isPaid, isScholarship, featured
- `SavedOpportunity`: userId
- `FeedPost`: userId, createdAt
- `FeedComment`: postId, userId
- `FeedLike`: postId, userId
- `Connection`: fromId, toId, status
- `Message`: senderId, receiverId, createdAt
- `Notification`: userId, isRead

## Relationships

```
User (1) ──→ (many) SavedOpportunity
User (1) ──→ (many) FeedPost
User (1) ──→ (many) FeedComment
User (1) ──→ (many) FeedLike
User (1) ──→ (many) Connection (from)
User (1) ──→ (many) Connection (to)
User (1) ──→ (many) Message (sent)
User (1) ──→ (many) Message (received)

Opportunity (1) ──→ (many) SavedOpportunity
FeedPost (1) ──→ (many) FeedComment
FeedPost (1) ──→ (many) FeedLike
```

## Data Lifecycle

### Opportunities
- **Creation**: Admin creates opportunity via dashboard
- **Visibility**: Available to all users for filtering and searching
- **Expiration**: Automatically marked as deleted after deadline passes (via cron job)
- **Retention**: Soft deleted (not permanently removed) for audit trail

### Feed Posts
- **Creation**: Any authenticated user can create a post
- **Visibility**: Public to all users (can be changed to connections-only)
- **Engagement**: Users can like and comment
- **Deletion**: Users can delete their own posts

### Connections
- **Request**: User sends connection request
- **Status**: PENDING → ACCEPTED/REJECTED/BLOCKED
- **Messaging**: Only accepted connections can message each other

### Messages
- **Delivery**: Real-time via Socket.IO
- **Read Status**: Tracked with isRead and readAt
- **Persistence**: All messages stored in database

## Cron Jobs

1. **Delete Expired Opportunities** (Daily at 00:00)
   - Marks opportunities with passed deadlines as deleted

2. **Send Deadline Reminders** (Daily at 10:00)
   - Sends notifications for deadlines in next 24 hours

3. **Send Weekly Digest** (Every Sunday at 09:00)
   - Email digest of curated opportunities
