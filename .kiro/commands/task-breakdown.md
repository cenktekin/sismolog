---
description: "Action: Systematically break down a large task from master-tasks.md into smaller, manageable sub-tasks and update all relevant documentation."
---

## Scope

This action applies to any significant task, feature, or bug listed in `docs/status/master-tasks.md` that is too large or complex to be completed in a single work session. The goal is to make large work items more approachable and trackable.

*   **Large Features**: e.g., "Implement user authentication system," "Build the analytics dashboard."
*   **Complex Bug Fixes**: e.g., "Resolve critical memory leak in data processing module."
*   **Major Refactoring**: e.g., "Migrate from monolithic to microservices architecture."
*   **Documentation Overhauls**: e.g., "Rewrite the entire API documentation."

## Objective

To transform a large, potentially ambiguous task into a clear, prioritized list of smaller, actionable sub-tasks. This breakdown improves planning, clarifies dependencies, makes progress easier to track, and helps in providing more accurate time estimates. The process must:

*   **Define Clear Boundaries**: Establish what is included and, just as importantly, what is *not* included in the parent task.
*   **Identify Dependencies**: Map out the relationships between the sub-tasks.
*   **Prioritize Sub-tasks**: Order the sub-tasks to create a logical workflow.
*   **Estimate Granularly**: Provide more accurate estimates for the smaller pieces.
*   **Update Documentation Faithfully**: Reflect the new structure in all relevant project documents.

## Deliverables

1.  The original large task in `docs/status/master-tasks.md` updated with a link to its new breakdown.
2.  A new, detailed sub-task list, either as a new file (e.g., `docs/status/master-tasks/FEATURE_X_SUBTASKS.md`) or as a nested structure within `master-tasks.md`.
3.  Updated `docs/status/PROJECT_DASHBOARD.md` to reflect the new, more granular task status.
4.  A brief entry in "SON ÇALIŞMA NOTLARI" (Last Work Session Notes) explaining the breakdown performed.

## Process

### 1. Görevi Seçme ve Tanımlama (Select and Define the Task)

1.  **Identify the Parent Task**:
    *   Open `docs/status/master-tasks.md`.
    *   Locate the large task you want to break down. It should be clearly defined, even if high-level.

2.  **Confirm Scope and Complexity**:
    *   Ensure the task is indeed too large for a single atomic change.
    *   Discuss with the project lead or team if there's any ambiguity about its size or components.

3.  **Define "Done" for the Parent Task**:
    *   Write a clear, concise definition of what "done" looks like for the entire task. This will be your north star for the breakdown.

### 2. Beyin Fırtınası ve Alt Görevleri Belirleme (Brainstorm and Identify Sub-tasks)

1.  **Deconstruct the Task**:
    *   Think about all the individual steps, components, and activities required to complete the parent task.
    *   Use a whiteboard, a document, or a mind-mapping tool to list everything that comes to mind. Don't filter or judge at this stage.

2.  **Categorize Activities**:
    *   Group the brainstormed items into logical categories. Common categories include:
        *   **Research & Analysis**: e.g., "Research best practices for X," "Analyze existing code for Y."
        *   **Design**: e.g., "Create wireframes for UI," "Define API endpoints for Z."
        *   **Development/Implementation**: e.g., "Build database schema," "Implement user model," "Create API route A."
        *   **Testing**: e.g., "Write unit tests for B," "Perform integration testing for C."
        *   **Documentation**: e.g., "Update user guide for D," "Create JSDoc for E."
        *   **Review & Deployment**: e.g., "Code review for F," "Deploy to staging environment."

3.  **Refine the Sub-task List**:
    *   Review the brainstormed list and combine or eliminate redundant items.
    *   Ensure each sub-task is a single, actionable item. A good test is: "Can one person complete this in a few hours to a day of focused work?"
    *   Avoid tasks that are too vague (e.g., "Work on feature X") or too detailed (e.g., "Fix typo in line 123 of file Y").

### 3. Önceliklendirme ve Bağımlılıkları Belirleme (Prioritize and Identify Dependencies)

1.  **Order the Sub-tasks**:
    *   Arrange the sub-tasks into a logical sequence. Some tasks can be done in parallel, while others must be done sequentially.
    *   A common approach is to use a simple priority (e.g., Must-do, Should-do, Nice-to-have) or to order them numerically (1, 2, 3...).

2.  **Map Dependencies**:
    *   For each sub-task, identify if it depends on the completion of any other sub-task.
    *   Note these dependencies clearly. This is crucial for planning and for identifying potential bottlenecks.

### 4. Tahminler Ekleme (Add Estimates)

1.  **Provide Time Estimates**:
    *   For each sub-task, add a realistic time estimate (e.g., in hours or person-days).
    *   Be conservative. It's better to underestimate slightly and finish early than to over-promise and fall behind.
    *   The sum of these estimates will give you a more accurate picture of the total parent task effort.

### 5. Dokümantasyonu Güncelleme (Update Documentation)

1.  **Update `docs/status/master-tasks.md`**:
    *   Go to the original parent task.
    *   Add a comment or a link pointing to the detailed breakdown. For example: `*See breakdown: [docs/status/master-tasks/FEATURE_X_SUBTASKS.md](docs/status/master-tasks/FEATURE_X_SUBTASKS.md)*`.
    *   If you are using a nested structure, update the parent task to reflect that it is now a "parent" or "epic" task.

2.  **Create the Detailed Sub-task Document**:
    *   Create a new file, for example, `docs/status/master-tasks/FEATURE_X_SUBTASKS.md`.
    *   Title it clearly (e.g., "Breakdown: Implement User Authentication System").
    *   Include:
        *   A link back to the parent task in `master-tasks.md`.
        *   The definition of "done" for the parent task.
        *   The prioritized list of sub-tasks, including their descriptions, estimates, and dependencies.
        *   A simple table or checklist for tracking progress.

    **Example Sub-task Document Structure:**
    ```markdown
    # Breakdown: Implement User Authentication System

    **Parent Task**: [Implement user authentication system](../master-tasks.md#implement-user-authentication-system)

    **Definition of Done**:
    - Users can register with an email and password.
    - Users can log in and receive a JWT.
    - Passwords are securely hashed.
    - API endpoints are protected.
    - All relevant documentation is updated.

    ## Sub-tasks

    | # | Sub-task | Estimate (hrs) | Dependencies | Status |
    |---|---|---|---|---|
    | 1 | Research and select auth library (e.g., Auth0, Firebase, or custom). | 4 | | ☐ |
    | 2 | Design user data schema (email, password hash, timestamps). | 2 | 1 | ☐ |
    | 3 | Set up database tables/migrations for users. | 3 | 2 | ☐ |
    | 4 | Implement user registration API endpoint. | 5 | 3 | ☐ |
    | 5 | Implement password hashing logic. | 2 | 4 | ☐ |
    | 6 | Implement user login API endpoint (JWT issuance). | 5 | 4, 5 | ☐ |
    | 7 | Create middleware for JWT validation. | 4 | 6 | ☐ |
    | 8 | Protect relevant API endpoints with the new middleware. | 3 | 7 | ☐ |
    | 9 | Write unit tests for all new auth logic. | 6 | 8 | ☐ |
    | 10 | Update API documentation with new endpoints and auth flow. | 3 | 9 | ☐ |
    | 11 | Deploy to staging and perform manual testing. | 4 | 10 | ☐ |

    ```

3.  **Update `docs/status/PROJECT_DASHBOARD.md`**:
    *   In the "AKTİF TASK'LAR" (Active Tasks) or a similar section, you can now list the first sub-task as the active item.
    *   Update the overall project progress metrics if this breakdown significantly changes the perceived workload.

4.  **Log the Work in "SON ÇALIŞMA NOTLARI"**:
    *   Add a note to the "SON ÇALIŞMA NOTLARI" section of the dashboard.
    *   Example: `* [DD/MM/YYYY] - Broke down "Implement user authentication system" into 11 sub-tasks for better tracking. Details: [docs/status/master-tasks/FEATURE_X_SUBTASKS.md](docs/status/master-tasks/FEATURE_X_SUBTASKS.md)`.

### 6. İlk Alt Göreve Başlama (Start on the First Sub-task)

1.  **Select the First Task**:
    *   Based on your prioritization, identify the first sub-task to work on.

2.  **Follow the Atomic Change Protocol**:
    *   Use the [`atomic-change.md`](./atomic-change.md) command to start working on the first sub-task.
    *   Update the `PROJECT_DASHBOARD.md` to reflect this new, specific active task.

## Roles & Responsibilities

*   **Task Owner/Developer**: Responsible for performing the breakdown, identifying dependencies, and updating all documentation.
*   **Project Lead/Manager**: Responsible for reviewing the breakdown for completeness, realism, and alignment with project goals.
*   **Team Members**: Can provide input during the brainstorming and dependency-mapping phases.

## Timeline

*   **Selection and Definition**: 15-30 minutes.
*   **Brainstorming and Deconstruction**: 30-60 minutes.
*   **Prioritization and Dependency Mapping**: 30 minutes.
*   **Estimation**: 20-40 minutes.
*   **Documentation Update**: 20-30 minutes.
*   **Total Estimated Time**: 2-3 hours.
