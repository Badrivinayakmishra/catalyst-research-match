# Catalyst Research Portal - Backend Integration Guide

## Overview
This is a Next.js 14 application for connecting undergraduate students with research opportunities. The frontend is complete with all UI components and mock data. This guide will help you integrate the backend.

---

## Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with inline styles
- **State Management**: React useState (local state)
- **Routing**: Next.js App Router (file-based routing)

---

## Project Structure

```
research-portal/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── login/page.tsx              # Student login
│   ├── signup/page.tsx             # Student signup
│   ├── dashboard/page.tsx          # Student dashboard
│   ├── browse/page.tsx             # Browse labs
│   ├── apply/page.tsx              # Application form
│   ├── profile/page.tsx            # Student profile settings
│   ├── messages/page.tsx           # Student messages
│   ├── pi-dashboard/page.tsx       # PI dashboard
│   ├── pi-opportunities/
│   │   ├── page.tsx                # Manage opportunities
│   │   └── new/page.tsx            # Post new opportunity
│   ├── pi-applications/
│   │   ├── page.tsx                # All applications
│   │   └── [id]/page.tsx           # Application detail view
│   ├── pi-messages/page.tsx        # PI messages
│   └── pi-profile/page.tsx         # Lab profile settings
├── public/                         # Static assets
├── package.json
└── BACKEND_INTEGRATION_GUIDE.md    # This file
```

---

## User Roles

### 1. Students
- Browse research opportunities
- Apply to positions
- Manage their profile
- Message PIs
- Track application status

### 2. Principal Investigators (PIs)
- Post research opportunities
- Review applications
- Message applicants
- Manage lab profile
- Accept/reject applicants

---

## Pages & Routes

### Student Pages

#### `/` - Landing Page
- Public marketing page
- CTAs for Sign Up and Sign In

#### `/signup` - Student Signup
- Form fields: name, email, password, major, year, GPA
- Backend needs: `POST /api/auth/signup`

#### `/login` - Student Login
- Form fields: email, password
- Backend needs: `POST /api/auth/login`

#### `/dashboard` - Student Dashboard
**Current mock data:**
```typescript
{
  name: string,
  major: string,
  year: string,
  gpa: string,
  savedLabs: Array<{
    id: number,
    name: string,
    pi: string,
    department: string,
    matchScore: number,
    openPositions: number
  }>,
  activeApplications: Array<{
    id: number,
    labName: string,
    position: string,
    status: 'pending' | 'under_review' | 'interview' | 'accepted' | 'rejected',
    appliedDate: string,
    lastUpdate: string
  }>,
  recommendations: Array<Lab>
}
```
**Backend needs:**
- `GET /api/student/dashboard` - Returns dashboard data
- `GET /api/student/saved-labs` - Saved labs
- `GET /api/student/applications` - Active applications
- `GET /api/student/recommendations` - AI-matched labs

#### `/browse` - Browse Labs
**Current mock data:**
```typescript
{
  labs: Array<{
    id: number,
    name: string,
    pi: string,
    department: string,
    researchAreas: string[],
    openPositions: number,
    description: string,
    opportunities: Array<{
      id: number,
      title: string,
      type: string,
      duration: string,
      compensation: string,
      postedDate: string,
      requirements: string[]
    }>
  }>
}
```
**Backend needs:**
- `GET /api/labs` - All labs with opportunities
- `POST /api/labs/{id}/save` - Save a lab
- `GET /api/labs/{id}` - Lab details

#### `/apply` - Application Form
**Form data:**
```typescript
{
  labId: number,
  positionId: number,
  resumeFile: File,
  coverLetter: string,
  availability: string,
  startDate: string,
  gpa: string,
  relevantCourses: string[],
  skills: string[],
  experience: string
}
```
**Backend needs:**
- `POST /api/applications` - Submit application
- `POST /api/upload/resume` - Upload resume file

#### `/profile` - Student Profile Settings
**Form data:**
```typescript
{
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  major: string,
  minor: string,
  year: string,
  gpa: string,
  graduationDate: string,
  bio: string,
  skills: string[],
  interests: string[],
  resume: File,
  linkedin: string,
  github: string,
  portfolio: string
}
```
**Backend needs:**
- `GET /api/student/profile` - Get profile
- `PUT /api/student/profile` - Update profile

#### `/messages` - Student Messages
**Current mock data:**
```typescript
{
  conversations: Array<{
    id: number,
    piName: string,
    piInitials: string,
    labName: string,
    lastMessage: string,
    timestamp: string,
    unread: boolean
  }>,
  messages: Array<{
    id: number,
    sender: 'student' | 'pi',
    senderName: string,
    text: string,
    timestamp: string
  }>
}
```
**Backend needs:**
- `GET /api/messages/conversations` - All conversations
- `GET /api/messages/{conversationId}` - Messages in conversation
- `POST /api/messages` - Send message
- WebSocket or polling for real-time updates

---

### PI Pages

#### `/pi-dashboard` - PI Dashboard
**Current mock data:**
```typescript
{
  piName: string,
  lab: string,
  department: string,
  metrics: {
    totalApplications: number,
    activePositions: number,
    responseRate: string,
    positionsFilled: number
  },
  recentApplications: Array<{
    id: number,
    studentName: string,
    position: string,
    gpa: string,
    major: string,
    year: string,
    status: 'pending' | 'shortlisted' | 'reviewed',
    appliedDate: string,
    skills: string[]
  }>,
  activePositions: Array<{
    id: number,
    title: string,
    applications: number,
    posted: string,
    deadline: string,
    status: 'active' | 'closing-soon'
  }>
}
```
**Backend needs:**
- `GET /api/pi/dashboard` - Dashboard data
- `GET /api/pi/metrics` - Stats/metrics
- `GET /api/pi/applications/recent` - Recent applications

#### `/pi-opportunities` - Manage Opportunities
**Current mock data:**
```typescript
{
  opportunities: Array<{
    id: number,
    title: string,
    status: 'active' | 'closing-soon' | 'filled' | 'closed',
    applications: number,
    views: number,
    posted: string,
    deadline: string,
    hoursPerWeek: string,
    compensation: string,
    description: string
  }>
}
```
**Backend needs:**
- `GET /api/pi/opportunities` - All opportunities
- `PUT /api/pi/opportunities/{id}` - Edit opportunity
- `DELETE /api/pi/opportunities/{id}` - Delete opportunity
- `POST /api/pi/opportunities/{id}/close` - Close position

#### `/pi-opportunities/new` - Post New Opportunity
**Form data:**
```typescript
{
  title: string,
  researchArea: string,
  description: string,
  responsibilities: string,
  qualifications: string,
  requiredSkills: string[],
  preferredSkills: string[],
  hoursPerWeek: string,
  duration: string,
  positions: number,
  labLocation: string,
  startDate: string,
  deadline: string,
  remote: boolean,
  compensation: 'Academic Credit' | 'Hourly Wage' | 'Stipend' | 'Volunteer',
  compensationAmount: string
}
```
**Backend needs:**
- `POST /api/pi/opportunities` - Create new opportunity

#### `/pi-applications` - Applications Management
**Current mock data:**
```typescript
{
  applications: Array<{
    id: number,
    studentName: string,
    studentEmail: string,
    positionId: number,
    positionTitle: string,
    gpa: string,
    major: string,
    year: string,
    status: 'pending' | 'shortlisted' | 'interviewed' | 'accepted' | 'rejected',
    appliedDate: string,
    skills: string[],
    availability: string,
    graduationDate: string,
    matchScore: number  // AI-generated match percentage
  }>
}
```
**Backend needs:**
- `GET /api/pi/applications` - All applications (with filters)
- `PUT /api/pi/applications/{id}/status` - Update application status
- `GET /api/pi/applications?position={id}` - Filter by position
- `GET /api/pi/applications?status={status}` - Filter by status

#### `/pi-applications/[id]` - Application Detail View
**Current mock data:**
```typescript
{
  id: number,
  studentName: string,
  studentEmail: string,
  studentPhone: string,
  positionTitle: string,
  gpa: string,
  major: string,
  minor: string,
  year: string,
  status: string,
  appliedDate: string,
  skills: string[],
  availability: string,
  graduationDate: string,
  matchScore: number,
  bio: string,
  experience: Array<{
    title: string,
    organization: string,
    duration: string,
    description: string
  }>,
  coursework: string[],
  statement: string,  // Cover letter
  resumeUrl: string
}
```
**Backend needs:**
- `GET /api/pi/applications/{id}` - Full application details
- `GET /api/files/resume/{applicationId}` - Download resume

#### `/pi-messages` - PI Messages
Same structure as student messages but from PI perspective.
**Backend needs:**
- `GET /api/pi/messages/conversations`
- `GET /api/pi/messages/{conversationId}`
- `POST /api/pi/messages`

#### `/pi-profile` - Lab Profile Settings
**Form data:**
```typescript
{
  // PI Info
  firstName: string,
  lastName: string,
  title: string,
  department: string,
  email: string,
  phone: string,
  officeLocation: string,

  // Lab Info
  labName: string,
  labBuilding: string,
  labRoom: string,
  labWebsite: string,
  labDescription: string,
  researchAreas: string[],

  // Links
  personalWebsite: string,
  googleScholar: string,
  twitter: string,
  linkedin: string
}
```
**Backend needs:**
- `GET /api/pi/profile` - Get PI/lab profile
- `PUT /api/pi/profile` - Update profile

---

## Key Features Requiring Backend Logic

### 1. Authentication & Authorization
- JWT or session-based auth
- Role-based access control (Student vs PI)
- Protected routes middleware

### 2. AI Matching Algorithm
The frontend displays **match scores** (e.g., "92% Match") for:
- Student recommendations (in `/dashboard`)
- Application rankings (in `/pi-applications`)

**Backend needs to implement:**
- Algorithm that compares student profile (GPA, major, skills, interests) with opportunity requirements
- Returns match percentage (0-100)

### 3. File Upload
- Resume upload (PDF, max 5MB)
- Store in cloud storage (S3, Google Cloud Storage, etc.)
- Return file URL for access

### 4. Real-time Messaging
- WebSocket connection or polling
- Message threading by conversation
- Unread message indicators
- Notification system

### 5. Search & Filtering
**Browse page needs:**
- Search by research area, lab name, PI name
- Filter by department, compensation type, duration

**Applications page needs:**
- Filter by position, status
- Search by student name, major

### 6. Email Notifications
Send emails for:
- Application received (to student & PI)
- Application status change
- New message received
- Interview scheduled
- Position deadline approaching

---

## API Endpoints Summary

### Authentication
```
POST   /api/auth/signup          - Student registration
POST   /api/auth/login           - Login (student or PI)
POST   /api/auth/logout          - Logout
GET    /api/auth/me              - Get current user
POST   /api/auth/forgot-password - Password reset
```

### Students
```
GET    /api/student/dashboard          - Dashboard data
GET    /api/student/profile            - Student profile
PUT    /api/student/profile            - Update profile
GET    /api/student/applications       - Student's applications
GET    /api/student/saved-labs         - Saved labs
POST   /api/student/saved-labs/{id}    - Save a lab
DELETE /api/student/saved-labs/{id}    - Unsave a lab
GET    /api/student/recommendations    - AI-matched recommendations
```

### Labs & Opportunities
```
GET    /api/labs                    - Browse all labs
GET    /api/labs/{id}               - Lab details
GET    /api/opportunities           - All opportunities
GET    /api/opportunities/{id}      - Opportunity details
```

### Applications
```
POST   /api/applications            - Submit application
GET    /api/applications/{id}       - Application details
DELETE /api/applications/{id}       - Withdraw application
```

### PI - Opportunities
```
GET    /api/pi/opportunities        - PI's opportunities
POST   /api/pi/opportunities        - Create opportunity
PUT    /api/pi/opportunities/{id}   - Update opportunity
DELETE /api/pi/opportunities/{id}   - Delete opportunity
POST   /api/pi/opportunities/{id}/close - Close position
```

### PI - Applications
```
GET    /api/pi/applications         - All applications for PI's positions
GET    /api/pi/applications/{id}    - Application detail
PUT    /api/pi/applications/{id}/status - Update status
```

### PI - Profile
```
GET    /api/pi/profile              - PI/lab profile
PUT    /api/pi/profile              - Update profile
GET    /api/pi/dashboard            - Dashboard data
GET    /api/pi/metrics              - Analytics/metrics
```

### Messages
```
GET    /api/messages/conversations  - All conversations
GET    /api/messages/{conversationId} - Messages in conversation
POST   /api/messages                - Send message
PUT    /api/messages/{id}/read      - Mark as read
```

### File Upload
```
POST   /api/upload/resume           - Upload resume
GET    /api/files/resume/{id}       - Download resume
```

---

## Database Schema Suggestions

### Users Table
```sql
id, email, password_hash, role (student/pi),
created_at, updated_at, last_login
```

### Students Table
```sql
id, user_id (FK), first_name, last_name,
major, minor, year, gpa, graduation_date,
bio, phone, linkedin, github, portfolio, resume_url
```

### PIs Table
```sql
id, user_id (FK), first_name, last_name,
title, department, phone, office_location,
personal_website, google_scholar, twitter, linkedin
```

### Labs Table
```sql
id, pi_id (FK), name, description, building,
room, website, created_at, updated_at
```

### ResearchAreas Table
```sql
id, lab_id (FK), area_name
```

### Opportunities Table
```sql
id, lab_id (FK), title, description,
responsibilities, qualifications, research_area,
hours_per_week, duration, positions_available,
location, start_date, deadline, remote,
compensation_type, compensation_amount,
status (active/closed/filled), views, created_at
```

### Skills Table (many-to-many)
```sql
id, name
opportunity_skills: opportunity_id, skill_id, required (boolean)
student_skills: student_id, skill_id
```

### Applications Table
```sql
id, student_id (FK), opportunity_id (FK),
cover_letter, availability, start_date,
status (pending/shortlisted/interviewed/accepted/rejected),
match_score, applied_at, updated_at
```

### Messages Table
```sql
id, sender_id (FK), receiver_id (FK),
conversation_id, message_text,
read (boolean), created_at
```

### SavedLabs Table
```sql
id, student_id (FK), lab_id (FK), saved_at
```

---

## Environment Variables Needed

Create a `.env.local` file (not included in this package):

```env
# Database
DATABASE_URL=

# Authentication
JWT_SECRET=
SESSION_SECRET=

# File Storage
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET_NAME=

# Email Service
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=

# API Keys (if using AI matching)
OPENAI_API_KEY=

# App Config
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## Integration Steps

### 1. Set up your backend API
- Create REST API endpoints listed above
- Implement authentication middleware
- Set up database with suggested schema

### 2. Replace mock data with API calls
Example for student dashboard:

**Current (Mock):**
```typescript
const [applications, setApplications] = useState([/* mock data */])
```

**Replace with:**
```typescript
const [applications, setApplications] = useState([])

useEffect(() => {
  fetch('/api/student/applications', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(res => res.json())
  .then(data => setApplications(data))
}, [])
```

### 3. Implement file upload
Replace form submissions with `FormData`:
```typescript
const formData = new FormData()
formData.append('resume', resumeFile)
formData.append('coverLetter', coverLetter)

fetch('/api/applications', {
  method: 'POST',
  body: formData,
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

### 4. Add authentication flow
- Implement login/signup API calls
- Store JWT token in localStorage or cookies
- Add authentication checks to protected pages
- Redirect unauthenticated users to `/login`

### 5. Set up real-time messaging
- Implement WebSocket server or use Socket.io
- Update message components to handle real-time updates

### 6. Deploy
- Build: `npm run build`
- Deploy frontend to Vercel/Netlify
- Deploy backend API
- Update environment variables

---

## Testing the Frontend

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit:
- Student flow: `http://localhost:3000`
- PI flow: `http://localhost:3000/pi-dashboard`

---

## Design System

### Colors
- **Primary Blue**: `#2563EB`
- **Navy**: `#0B2341`
- **Warm Beige**: `#F9F7F2`
- **Gray scale**: `#64748B`, `#94A3B8`, `#E2E8F0`
- **Status colors**:
  - Pending: `#F59E0B` (Orange)
  - Shortlisted: `#8B5CF6` (Purple)
  - Interviewed: `#3B82F6` (Blue)
  - Accepted: `#10B981` (Green)
  - Rejected: `#EF4444` (Red)

### Fonts
- Headings: `'Fraunces', serif`
- Body: `'Plus Jakarta Sans', sans-serif`

### Components
All components are built inline with Tailwind + inline styles. No separate component library required.

---

## Notes for Backend Team

1. **All data is currently mocked** - Search for `// Mock` comments in the code to find where to replace with API calls

2. **Match Score Algorithm** - The `matchScore` field (92%, 88%, etc.) needs to be calculated by your backend based on student qualifications vs opportunity requirements

3. **Status Updates** - When PIs change application status (Shortlist, Interview, Accept, Reject), this should trigger email notifications

4. **File Security** - Ensure resume files are only accessible to:
   - The student who uploaded it
   - The PI of the opportunity they applied to

5. **Rate Limiting** - Consider rate limiting on:
   - Application submissions (e.g., max 10 per day)
   - Message sending (e.g., max 50 per day)

6. **Search Optimization** - For the browse page, consider implementing:
   - Full-text search with PostgreSQL or Elasticsearch
   - Caching for frequently accessed labs

7. **Analytics** - Track metrics like:
   - Application-to-acceptance ratio
   - Time to first response
   - Most popular research areas
   - Student engagement rates

---

## Support & Questions

For questions about the frontend implementation:
- Review the code in `/app` directory
- All forms have TypeScript types defined inline
- Mock data structure mirrors expected API responses

Good luck with the integration! 🚀
