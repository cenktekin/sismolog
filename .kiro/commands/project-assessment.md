---
description: "Action: Perform a mandatory initial project assessment to understand context, status, and next steps."
---

## Scope

This action covers the first 5 minutes of engaging with any project, as mandated by the Project Entry Protocol. It is designed to quickly establish context and identify immediate priorities.

*   **Project Dashboards**: `docs/status/PROJECT_DASHBOARD.md` and related status files.
*   **Core Documentation**: `docs/status/DEVELOPMENT_STATUS.md`, `docs/status/master-tasks.md`.
*   **Security Context**: `docs/security/SECURITY_CONFIG.md`.
*   **File Location Mappings**: `docs/ALIAS_MAP.json`.

## Objective

To rapidly understand the current state of a project, identify any critical issues, and determine the most logical next action. The assessment must:

*   **Parse the Project Dashboard**: Understand the high-level project status, active tasks, and recent work context.
*   **Review Detailed Status**: Check the development status and master task list for a deeper understanding of ongoing work.
*   **Assess Security Context**: Be aware of the current security posture and any relevant configurations.
*   **Verify File Locations**: Understand how documentation is structured and where to find key files.
*   **Identify Blockers**: Determine if there are any immediate obstacles to starting work.

## Deliverables

1.  A clear understanding of the project's current state.
2.  A list of any critical issues requiring immediate attention.
3.  A list of currently active tasks and their progress.
4.  An understanding of the last work session's context.
5.  A defined "next logical action" to take.

## Process

### Step 1: Dashboard Analysis (2 minutes)

1.  **Locate and Read `docs/status/PROJECT_DASHBOARD.md`**:
    *   This is the **FIRST** file you MUST read.
    *   If it does not exist, check `docs/ALIAS_MAP.json` for an alternative location or a note on its status.
    *   If it is missing and no alias exists, this is a critical issue. Report it and create an emergency version from a template if necessary.

2.  **Parse Key Sections in Order**:
    *   **Proje Durumu (Project Status)**: Read the summary of the current project state.
    *   **ACİL DURUM (Critical Issues)**: Identify any items listed here. These take priority.
    *   **AKTİF TASK'LAR (Active Tasks)**: Note the tasks currently in progress and their completion percentage.
    *   **SON ÇALIŞMA NOTLARI (Last Work Session Notes)**: Understand what was worked on most recently.

### Step 2: Context Building (2 minutes)

1.  **Check `docs/status/DEVELOPMENT_STATUS.md`**:
    *   Read this file for a more detailed status update.
    *   Focus on any sections related to the current sprint or phase of the project.

2.  **Review `docs/status/master-tasks.md`**:
    *   Get a complete picture of all known tasks, bugs, and features.
    *   This helps in understanding the broader roadmap and how current tasks fit in.

3.  **Scan `docs/security/SECURITY_CONFIG.md`**:
    *   Briefly review the security configuration.
    *   Pay attention to any recent changes or active warnings that might impact your work.

4.  **Check `docs/ALIAS_MAP.json`**:
    *   Familiarize yourself with the project's file structure and any aliases for moved or renamed documents.
    *   This is crucial for avoiding confusion when looking for files.

### Step 3: Work Planning (1 minute)

1.  **Identify Next Logical Action**:
    *   Based on the project status, active tasks, and your own goals, determine the most appropriate next step.
    *   Refer to the "SONRAKI ADIMLAR" (Next Steps) section in the `PROJECT_DASHBOARD.md` if available.
    *   Common next actions include: starting a new task, reviewing a pull request, updating documentation, or fixing a critical bug.

2.  **Check for Blockers or Dependencies**:
    *   Are there any prerequisites for your intended next action?
    *   Are there any known issues that could prevent you from making progress?

3.  **Confirm Understanding with User (if applicable)**:
    *   If you are an AI assistant or a new team member, briefly confirm your understanding of the project state and the planned next action with the user or project lead.

## Roles & Responsibilities

*   **Developer/AI Tool**: Responsible for executing the assessment steps accurately and reporting findings.
*   **Project Lead/Manager**: Responsible for ensuring the `PROJECT_DASHBOARD.md` and other status files are kept up-to-date and accurate.

## Timeline

*   **Total Duration**: 5 minutes.
*   **Dashboard Analysis**: 2 minutes.
*   **Context Building**: 2 minutes.
*   **Work Planning**: 1 minute.
