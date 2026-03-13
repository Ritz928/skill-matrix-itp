Design a **Skill Matrix module** for an enterprise workforce management platform called **In Time Pro (ITP)**.

The module helps organizations capture employee skills, validate proficiency levels, analyze workforce capability, and allocate employees to projects.

The system should support the following user roles:

• Employee
• Manager
• HR/Admin
• Leadership
• Project Managers

Create a **modern enterprise SaaS dashboard UI** with clean layouts, cards, tables, filters, analytics charts, and modular components.

---

APPLICATION LAYOUT

The interface should follow a **typical enterprise SaaS layout with a persistent LEFT SIDEBAR navigation**, not a top navigation bar.

Layout structure:

Left Sidebar Navigation
Main Content Area
Optional Right Context Panel

Sidebar Navigation Items:

Dashboard
Skill Matrix
Employee Skills
Team Skills
Skill Validation
Skill Taxonomy (Admin)
Skill Analytics
Project Skill Matching
Learning & Development

The sidebar should be collapsible and highlight the active module.

Include breadcrumb navigation in the main content area.

Example breadcrumb:

Skill Matrix > Employee Skills > Employee Profile

---

MODULE OBJECTIVE

The Skill Matrix module allows organizations to:

• Maintain a centralized skill repository
• Track employee skill proficiency
• Validate skill levels through managers
• Identify skill gaps in teams
• Match employees to projects
• Support employee learning and development

---

SKILL STRUCTURE

Skills are organized in a hierarchical taxonomy.

Category → Subcategory → Skill

Example:

Development
→ Frontend
→ React

Cloud
→ Platforms
→ AWS

Each skill includes:

• Skill name
• Skill description
• Category and subcategory
• Proficiency framework

Admins can create, edit, archive, or merge skills.

---

PROFICIENCY FRAMEWORK

Each skill uses standardized levels.

Beginner
Basic understanding and limited experience.

Intermediate
Can work independently and complete common tasks.

Advanced
Strong experience and capable of designing solutions.

Expert
Deep expertise and can mentor others.

Use visual indicators like badges or progress bars to represent proficiency.

---

SKILL RATING MECHANISM

Skill proficiency is evaluated through multiple sources.

Self Assessment
Employees select their own level when adding a skill.

Manager Validation
Managers review and approve skill submissions.

Peer Endorsement
Colleagues may endorse skills based on collaboration.

System Generated Confidence
System increases confidence score based on certifications or project usage.

Each skill should display a validation status:

Self-assessed
Pending validation
Validated
Rejected

---

EMPLOYEE SKILL PROFILE FLOW

Employees maintain their personal skill profiles.

Features include:

• Add skills from taxonomy
• Select proficiency level
• Upload certification evidence
• Tag project experience
• Submit skills for validation
• Track validation status
• View feedback from managers

Each skill card displays:

Skill Name
Category
Proficiency Level
Evidence Attachments
Validation Status
Last Updated Date

Workflow:

Employee adds skill
Skill appears as **Self-assessed**
Employee uploads evidence
Employee submits for validation
Skill status becomes **Pending validation**

If an employee edits the proficiency level of a validated skill, the status returns to **Pending validation**.

---

ADD SKILL WORKFLOW

Step 1
Employee clicks **Add Skill**

Step 2
Form opens with fields:

Skill Category
Skill Subcategory
Skill Name
Proficiency Level
Years of Experience
Last Used Date
Certification Upload
Project Experience Tagging

Step 3
Employee submits the skill

Step 4
Manager receives validation request

---

MANAGER VALIDATION WORKFLOW

Managers review skill validation requests from their team.

Manager features:

• View list of pending validation requests
• Review employee submitted evidence
• Approve skill proficiency
• Adjust proficiency level if needed
• Reject submissions
• Provide feedback comments

Workflow:

Employee submits skill
Manager receives validation request
Manager reviews evidence
Manager approves or adjusts proficiency
Employee receives notification
Skill becomes **Validated**

The validation interface should display:

Employee name
Skill requested
Requested proficiency level
Evidence preview
Manager decision controls
Feedback comment field

---

HR / ADMIN TAXONOMY MANAGEMENT

Admins maintain the organization’s skill taxonomy.

Skill structure:

Category → Subcategory → Skill

Each skill contains:

Skill name
Skill definition
Category and subcategory
Proficiency framework

Admin capabilities:

Create categories
Create subcategories
Create skills
Edit skill definitions
Archive outdated skills

The taxonomy should be displayed using a **hierarchical tree view**.

---

TEAM SKILL OVERVIEW

Managers can view the distribution of skills across their team.

Features:

• Filter employees by skill
• Compare proficiency levels
• Identify experts in the team
• View validated vs self-assessed skills

Include charts such as:

Skill distribution charts
Proficiency comparison tables
Team capability overview

---

LEADERSHIP ANALYTICS DASHBOARD

Leadership users can analyze workforce capability.

Analytics include:

Skill distribution across departments
Skill gap analysis
Validated vs self-assessed ratios
Organization skill heatmaps

Heatmap example:

Departments vs Skill Proficiency

Users should be able to drill down:

Organization → Department → Team

Reports should be exportable.

---

PROJECT SKILL MATCHING

Managers can use the Skill Matrix to find employees for projects.

Project setup includes:

Required Skills
Required Proficiency Level
Number of Resources Needed

The system recommends employees based on:

Skill match
Proficiency level
Validation status
Experience

Results should show:

Employee name
Match score
Proficiency level
Validation status

---

LEARNING AND DEVELOPMENT INTEGRATION

If a skill gap is identified, the system recommends learning programs.

Example:

Skill Gap: AWS Advanced

Recommended Learning:

AWS Certification Training
Cloud Architecture Course

---

SCREENS TO DESIGN

1. Skill Matrix Dashboard
2. Employee Skill Profile
3. Add Skill Modal
4. Manager Skill Validation Panel
5. Admin Skill Taxonomy Management
6. Team Skill Overview Dashboard
7. Organization Skill Heatmap
8. Project Skill Matching Interface
9. Learning Recommendation Panel

---

DESIGN STYLE

Enterprise SaaS dashboard
Left sidebar navigation (not top navigation)
Clean modern UI
Data tables and analytics charts
Skill badges and validation indicators
Cards for summaries
Filters and search functionality
Desktop-first layout
