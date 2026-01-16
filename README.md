# Team Time - QA Take-Home Exercise

Welcome! This exercise is designed to evaluate your approach to quality assurance for a web application. You'll be working with **Team Time**, a team event scheduling application.

## The Application

Team Time helps teams coordinate event scheduling through collaborative time proposals and voting. Key features include:

- **User Authentication**: Login with email/password, JWT-based sessions
- **Event Management**: Create events with name, description, and proposed times
- **Time Proposals**: Any team member can propose additional times for an event
- **Voting System**: Team members vote (+/-) on proposed times
- **Event Finalization**: The event creator selects and locks in a final time
- **Calendar View**: Visual calendar showing scheduled and pending events
- **Team Scoping**: Events are visible only to members of the same team

## Accessing the Application

### Option 1: Run Locally (Recommended)

```bash
# Clone the repository
git clone https://github.com/Revobo/team-time.git
cd team-time

# Create env file
cp .env.docker.template .env # on windows: copy .env.docker.template .env

# Start the database
docker compose up -d

# Install dependencies
npm install

# Run migrations and seed data
npm run drizzle:migrate
npm run drizzle:seed

# Start the development server
npm run dev
```

The app will be available at http://localhost:5173

### Option 2: Live Site

The application is deployed at: **https://team-time.fly.dev/**

### Test Credentials

| Email             | Password       | Team        |
| ----------------- | -------------- | ----------- |
| alice@example.com | TestPassword1! | Engineering |
| bob@example.com   | TestPassword1! | Engineering |
| carol@example.com | TestPassword1! | Engineering |
| dan@example.com   | TestPassword1! | Design      |
| eve@example.com   | TestPassword1! | Design      |
| frank@example.com | TestPassword1! | Design      |

## Your Task

Imagine you're joining this project as a QA Analyst. Your goal is to establish a quality assurance foundation and conduct an initial evaluation.

### Deliverables

1. **Test Plan / Strategy Document**

   - Your recommended testing approach for this application
   - Types of testing you would implement (functional, regression, performance, etc.)
   - Tooling recommendations
   - How QA fits into the development workflow

2. **Test Cases**

   - Sample test case document or test suite outline
   - Cover critical user journeys
   - Include both positive and negative scenarios

3. **Automation Approach**

   - Outline or proof-of-concept for automated testing
   - Tool selection rationale (Playwright, Cypress, etc.)
   - Sample code or pseudocode demonstrating your approach

4. **Initial Evaluation**

   - Conduct a smoke test of the application
   - Document any bugs, usability issues, or concerns
   - Include improvement suggestions

5. **Supporting Documentation** (optional but encouraged)
   - Bug report template
   - Test data strategy
   - Reporting/metrics approach

## Evaluation Criteria

We're looking for:

- **Strategic Thinking**: A sustainable, long-term approach to quality
- **Practical Clarity**: Documentation that could onboard another team member
- **Technical Depth**: Understanding of modern testing tools and practices
- **Attention to Detail**: Thoroughness in your initial evaluation
- **Communication**: Clear, organized presentation of findings

## Submission

**Estimated time**: 2-4 hours

As part of the process, you will be provided access to a Google Drive. All documentation, code, etc should either be placed in the drive or instructions should be given to access it.

---

## Tech Stack Reference

- **Frontend**: React 19, TypeScript, Material-UI, Vite
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT
- **Deployment**: Docker, fly.io
