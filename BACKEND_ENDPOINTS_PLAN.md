# Catalyst Backend API - Implementation Plan

## Overview
This document outlines all backend endpoints needed to integrate with the new research portal frontend.

**Status**: Updated schema complete, implementing endpoints

**Excluded Features**:
- ❌ Real-time messaging system (per user request)
- ❌ Heavy AI/ML models (using simple matching instead)

---

## Database Schema Status

### ✅ Completed Tables
- `users` - Authentication and user management
- `students` - Extended student profiles (GPA, major, skills, interests, resume_url, etc.)
- `pis` - Professor/PI profiles
- `labs` - Research labs linked to PIs
- `opportunities` - Detailed research position postings
- `applications` - Student applications with match scores and status
- `saved_labs` - Student bookmarking feature
- `password_resets` - Password reset tokens

---

## API Endpoints Implementation Status

### 🟢 Authentication Endpoints (Partially Complete)

#### ✅ Existing (need updates)
```
POST /api/auth/signup          - Create user account
POST /api/auth/login           - User login
POST /api/auth/forgot-password - Request password reset
POST /api/auth/reset-password  - Reset password with token
POST /api/auth/google/callback - Google OAuth login
```

#### 🔴 Needs Implementation
```
POST /api/auth/signup (EXTENDED)
  - Accept additional fields: major, minor, year, gpa, studentId, phone
  - Create student profile record in students table
  - Support file upload for resume/transcript during signup

POST /api/auth/pi/signup
  - Create PI account with profile
  - Fields: firstName, lastName, title, department, phone, officeLocation

GET /api/auth/me
  - Return current user info based on session/token
  - Include role (student/pi) and profile data
```

---

### 🔴 Student Endpoints (All Need Implementation)

#### Student Dashboard
```
GET /api/student/dashboard
  - Return: student profile, saved labs, active applications, recommendations
  - Response structure:
    {
      name: string,
      major: string,
      year: string,
      gpa: string,
      savedLabs: [{id, name, pi, department, matchScore, openPositions}],
      activeApplications: [{id, labName, position, status, appliedDate, lastUpdate}],
      recommendations: [Lab objects with match scores]
    }
```

#### Student Profile
```
GET /api/student/profile
  - Return full student profile from students table
  - Include: firstName, lastName, email, phone, studentId, major, minor, year,
    gpa, graduationDate, bio, linkedin, github, portfolio, resume_url,
    transcript_url, skills[], interests[]

PUT /api/student/profile
  - Update student profile
  - Support multipart/form-data for resume/transcript file uploads
  - Update skills and interests as comma-separated or JSON array
```

#### Student Applications
```
GET /api/student/applications
  - Return all applications for logged-in student
  - Join with opportunities and labs tables for full details
  - Include match_score, status, dates

GET /api/student/recommendations
  - Return AI-matched lab opportunities
  - Calculate simple match scores based on:
    * Skills overlap (student.skills vs opportunity.required_skills)
    * Research interests alignment
    * GPA requirements
    * Major/department matching
  - Return percentage score (0-100)
```

#### Saved Labs
```
GET /api/student/saved-labs
  - Return all saved/bookmarked labs for student
  - Include lab details and current open opportunities

POST /api/student/saved-labs/{labId}
  - Save/bookmark a lab
  - Create record in saved_labs table

DELETE /api/student/saved-labs/{labId}
  - Remove saved lab
```

---

### 🔴 Labs & Opportunities Endpoints (Need Major Updates)

#### Browse Labs
```
GET /api/labs
  - Return all labs with their opportunities
  - Join labs + pis + opportunities tables
  - Support query params:
    * ?search=keyword (search lab name, PI name, research areas)
    * ?department=Computer Science
    * ?researchArea=Machine Learning
  - Response structure:
    {
      labs: [{
        id, name, pi, department, researchAreas[],
        openPositions: count,
        description,
        opportunities: [{id, title, type, duration, compensation, postedDate, requirements[]}]
      }]
    }

GET /api/labs/{id}
  - Return specific lab details
  - Include PI info, all opportunities, research areas
```

#### Opportunities
```
GET /api/opportunities
  - Return all active opportunities across all labs
  - Support filtering and search

GET /api/opportunities/{id}
  - Return specific opportunity details
  - Include lab info, PI info, requirements
```

---

### 🔴 Applications Endpoints (Need Major Updates)

```
POST /api/applications
  - Submit application to an opportunity
  - Accept multipart/form-data:
    * opportunityId
    * resumeFile (optional if already in profile)
    * coverLetter
    * availability
    * startDate
    * relevantCourses[] (optional)
  - Calculate match_score using simple algorithm
  - Create application record
  - Send email notification to student & PI

GET /api/applications/{id}
  - Return full application details
  - Include student profile, resume URL, cover letter

DELETE /api/applications/{id}
  - Withdraw application (only if status is 'pending')
```

---

### 🔴 PI Endpoints (All Need Implementation)

#### PI Dashboard
```
GET /api/pi/dashboard
  - Return PI dashboard data
  - Response:
    {
      piName, lab, department,
      metrics: {totalApplications, activePositions, responseRate, positionsFilled},
      recentApplications: [{id, studentName, position, gpa, major, year, status, appliedDate, skills[]}],
      activePositions: [{id, title, applications, posted, deadline, status}]
    }

GET /api/pi/metrics
  - Return analytics/statistics
  - Application counts, acceptance rates, popular positions, etc.
```

#### PI Opportunities Management
```
GET /api/pi/opportunities
  - Return all opportunities for the logged-in PI's lab
  - Include application counts, views, status

POST /api/pi/opportunities
  - Create new research opportunity
  - Fields: title, researchArea, description, responsibilities, qualifications,
    requiredSkills[], preferredSkills[], hoursPerWeek, duration, positions,
    labLocation, startDate, deadline, remote, compensationType, compensationAmount

PUT /api/pi/opportunities/{id}
  - Update opportunity details
  - Only allow if PI owns the opportunity

DELETE /api/pi/opportunities/{id}
  - Delete opportunity
  - Only if no applications or all applications are rejected/withdrawn

POST /api/pi/opportunities/{id}/close
  - Mark opportunity as closed/filled
  - Update status to 'closed' or 'filled'
```

#### PI Applications Management
```
GET /api/pi/applications
  - Return all applications for PI's opportunities
  - Support query params:
    * ?position={opportunityId}
    * ?status=pending
  - Include student profiles, match scores
  - Sort by match_score DESC by default

GET /api/pi/applications/{id}
  - Return full application details
  - Include student profile, experience, coursework, cover letter, resume URL
  - Calculate and return match score

PUT /api/pi/applications/{id}/status
  - Update application status
  - Allowed statuses: pending, shortlisted, interviewed, accepted, rejected
  - Send email notification to student on status change
```

#### PI Profile
```
GET /api/pi/profile
  - Return PI profile + lab profile
  - Join pis + labs tables
  - Include: PI info (firstName, lastName, title, department, contact, links)
    and Lab info (name, building, room, website, description, researchAreas[])

PUT /api/pi/profile
  - Update PI and lab profile
  - Support updating both PI and lab information
```

---

### 🔴 File Upload Endpoints (Need Implementation)

```
POST /api/upload/resume
  - Accept file upload (PDF, max 5MB)
  - Store file locally in backend/uploads/ directory or S3
  - Return file URL
  - Associate with student profile or application

POST /api/upload/transcript
  - Same as resume upload
  - Store transcript PDF

GET /api/files/resume/{filename}
  - Serve resume file
  - Security: Only accessible by:
    * The student who owns it
    * PIs whose opportunities the student applied to

GET /api/files/transcript/{filename}
  - Serve transcript file
  - Same security restrictions as resume
```

---

## Simple AI Matching Algorithm

**Goal**: Calculate match score (0-100) between student and opportunity without heavy ML models.

### Algorithm Components:

1. **Skills Match (40 points)**
   - Required skills: +8 points per match
   - Preferred skills: +4 points per match
   - Cap at 40 points

2. **Research Interests Match (20 points)**
   - Compare student interests with opportunity research area
   - Text similarity (case-insensitive substring matching)
   - Cap at 20 points

3. **GPA Match (15 points)**
   - If opportunity requires minimum GPA:
     * Meets requirement: 15 points
     * Below requirement: 0 points
   - If no GPA requirement: 15 points (neutral)

4. **Major/Department Match (15 points)**
   - Same department: 15 points
   - Related department: 10 points
   - Different: 5 points

5. **Year/Experience Level (10 points)**
   - Matches preferred year: 10 points
   - Close (±1 year): 5 points
   - Other: 2 points

**Total: 100 points**

### Implementation:
```python
def calculate_simple_match_score(student, opportunity):
    score = 0

    # Skills matching (40 points)
    student_skills = set(s.lower().strip() for s in student['skills'].split(','))
    required_skills = set(s.lower().strip() for s in opportunity['required_skills'].split(','))
    preferred_skills = set(s.lower().strip() for s in opportunity.get('preferred_skills', '').split(','))

    required_matches = len(student_skills & required_skills)
    preferred_matches = len(student_skills & preferred_skills)
    score += min(required_matches * 8 + preferred_matches * 4, 40)

    # Research interests matching (20 points)
    student_interests = student.get('interests', '').lower()
    opportunity_area = opportunity.get('research_area', '').lower()
    if any(interest in opportunity_area for interest in student_interests.split(',')):
        score += 20

    # GPA matching (15 points)
    min_gpa = opportunity.get('minimum_gpa', 0.0)
    if float(student.get('gpa', 0)) >= min_gpa:
        score += 15

    # Major/department matching (15 points)
    if student.get('major', '').lower() == opportunity.get('preferred_major', '').lower():
        score += 15
    elif student.get('major', '') in opportunity.get('related_majors', []):
        score += 10
    else:
        score += 5

    # Year matching (10 points)
    preferred_year = opportunity.get('preferred_year', '')
    student_year = student.get('year', '')
    if student_year == preferred_year:
        score += 10
    elif abs(int(student_year or 0) - int(preferred_year or 0)) <= 1:
        score += 5
    else:
        score += 2

    return min(score, 100)  # Cap at 100
```

---

## Implementation Priority

### Phase 1: Critical Endpoints (Do First)
1. ✅ Fix database schema (DONE)
2. 🔄 Extended student signup with profile fields (IN PROGRESS)
3. PI signup with profile creation
4. Student dashboard endpoint
5. Browse labs with opportunities
6. Basic file upload (resume/transcript)

### Phase 2: Core Features
7. Student profile get/update
8. Submit application with match score calculation
9. PI dashboard endpoint
10. PI create/manage opportunities
11. PI view/filter applications

### Phase 3: Advanced Features
12. Update application status
13. Student recommendations with AI matching
14. Saved labs functionality
15. Search and filtering for browse page
16. Email notifications for status changes

### Phase 4: Polish
17. File access security checks
18. Rate limiting
19. Error handling improvements
20. Analytics/metrics endpoints

---

## Next Steps

1. **Fix existing endpoints** to match new database schema
   - `/api/labs` - Update to join with pis and opportunities tables
   - `/api/labs/{id}` - Update to new schema
   - `/api/labs/{id}/apply` - Update to use opportunities instead

2. **Implement extended signup**
   - Accept additional student profile fields
   - Create student record in students table
   - Handle file uploads for resume/transcript

3. **Implement student dashboard**
   - Aggregate data from multiple tables
   - Calculate match scores for recommendations
   - Return saved labs and applications

4. **Implement file upload system**
   - Set up local file storage in backend/uploads/
   - Return file URLs
   - Add security middleware to protect files

5. **Deploy and test**
   - Push to Render
   - Test all critical endpoints
   - Verify frontend integration

---

## Environment Variables Needed

Add to Render:
```
FLASK_SECRET_KEY=<existing>
SENDGRID_API_KEY=<existing>
SENDGRID_SENDER_EMAIL=<existing>
GOOGLE_CLIENT_ID=<existing>
GOOGLE_CLIENT_SECRET=<existing>
GOOGLE_REDIRECT_URI=<existing>

# New additions:
UPLOAD_FOLDER=/opt/render/project/src/backend/uploads
MAX_UPLOAD_SIZE=5242880  # 5MB in bytes
ALLOWED_EXTENSIONS=pdf,doc,docx
```
