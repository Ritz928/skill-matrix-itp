---

PROJECT CREATION AND SKILL MATCHING FLOW

Managers should be able to create projects and define required skills for staffing.

Project Creation Flow:

Step 1
Manager opens the **Project Skill Matching** module.

Step 2
Manager clicks **Create Project**.

Step 3
A project creation form opens with the following fields:

Project Name
Project Description
Department / Team
Start Date
End Date
Project Manager
Number of Required Resources

Step 4
Manager defines **required skills for the project**.

Each skill requirement includes:

Skill Category
Skill Subcategory
Skill Name
Required Proficiency Level
Priority Level (High / Medium / Low)

Managers can add multiple skill requirements.

Example:

Frontend – React – Advanced
Backend – Node.js – Intermediate
Cloud – AWS – Intermediate

Step 5
After defining skill requirements, the system generates **recommended employees** based on:

Skill match
Proficiency level
Validation status
Experience

Results should display:

Employee Name
Match Score
Proficiency Level
Validation Status
Years of Experience

Managers can filter results by:

Skill proficiency
Validation status (Validated / Self-assessed)
Department
Availability

Managers can then **select employees and assign them to the project**.

---

SKILL TAXONOMY MANAGEMENT WITH CATEGORY STRUCTURE

HR/Admin users manage the organization’s skill taxonomy.

Skills must follow a hierarchical structure:

Category → Subcategory → Skill

Example taxonomy:

Development
→ Frontend
→ React

Development
→ Backend
→ Node.js

Cloud
→ Platforms
→ AWS

Admin capabilities include:

Create Category
Edit Category
Archive Category

Create Subcategory
Edit Subcategory
Move subcategories between categories

Create Skill
Edit Skill
Add Skill Definition
Archive Skill

Taxonomy should be displayed as a **hierarchical tree view** for easy navigation.

Example UI layout:

Left Panel: Taxonomy Tree Structure
Right Panel: Skill Details Editor

When an admin creates a new category or skill, it should immediately become available in the **Employee Skill Profile Add Skill form**.

---

SCREENS TO DESIGN

1. Skill Matrix Dashboard
2. Employee Skill Profile
3. Add Skill Modal
4. Manager Skill Validation Panel
5. Admin Skill Taxonomy Management
6. Category and Subcategory Management
7. Team Skill Overview Dashboard
8. Organization Skill Heatmap
9. Project Creation Screen
10. Project Skill Matching Interface
11. Learning Recommendation Panel

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
