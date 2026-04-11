---
description: "Action: Execute a single, focused change to the codebase or documentation, following atomic change principles."
---

## Scope

This action applies to any modification made to the project, whether it's a code change, a documentation update, or a configuration adjustment. The core principle is that one action should address one specific task or issue.

*   **Code Changes**: Bug fixes, small feature implementations, refactoring of a single component.
*   **Documentation Changes**: Updating a single guide, fixing a set of broken links, adding a new section to a spec.
*   **Configuration Changes**: Updating a config file, modifying a script, adding a new environment variable.

## Objective

To make changes to the project in a controlled, low-risk manner that minimizes unintended consequences and simplifies the review process. The atomic change process must:

*   **Define a Single, Clear Objective**: The change should have one purpose and be easily understandable.
*   **Be Self-Contained**: The change should not depend on, or be a prerequisite for, another unrelated change.
*   **Minimize Side Effects**: The change should have as little impact as possible on other parts of the system.
*   **Be Easily Reversible**: If an atomic change causes a problem, it can be easily identified and reverted.

## Deliverables

1.  A completed and committed change that addresses a single, well-defined task.
2.  A pull request with a clear title and description that explains the purpose and impact of the change.
3.  Updated project status files (e.g., `PROJECT_DASHBOARD.md`, `master-tasks.md`) reflecting the completion of the task.
4.  A brief summary of the work completed in the "SON ÇALIŞMA NOTLARI" (Last Work Session Notes) section of the dashboard.

## Process

### 1. Before Starting Any Task

1.  **Update Project Dashboard**:
    *   Open `docs/status/PROJECT_DASHBOARD.md`.
    *   Update the timestamp to the current date and time.
    *   In the "AKTİF TASK'LAR" (Active Tasks) section, log the specific task you are about to work on.
    *   Estimate the completion time and update the progress percentage if applicable.

2.  **Confirm Task Scope**:
    *   Ensure the task is small enough to be completed in one session.
    *   If the task is too large, break it down into smaller, atomic sub-tasks.

3.  **Check for Dependencies**:
    *   Verify that there are no blockers preventing you from starting the task.
    *   Ensure any prerequisites have been completed.

### 2. During Task Execution

1.  **Follow Atomic Change Principles**:
    *   **One Task, One Focus**: Work on only one thing at a time. Resist the urge to "fix" other unrelated issues you discover.
    *   **No-Delete Principle**: Instead of deleting files, move them to `docs/archive/` with the required metadata (`source_of_truth`, `version_notes`, `deprecated_since`).
    *   **Dry-Run Before Major Changes**: For any significant changes (e.g., file movements, bulk link updates), run a dry-run script first (e.g., `bash scripts/dry_run.sh`).

2.  **Use Standardized File Locations**:
    *   Place new or modified files in their correct locations according to the project's structure (e.g., `docs/guides/`, `.kiro/specs/`).
    *   Use templates from `templates/TEMPLATES/[category]/` when creating new documents.

3.  **Maintain Relative Links and Metadata**:
    *   All internal links must be relative (e.g., `../guides/another-guide.md`).
    *   Ensure all documents have proper metadata, such as creation/update dates and `source_of_truth` references.

### 3. After Task Completion

1.  **Update Task Progress**:
    *   Return to `docs/status/PROJECT_DASHBOARD.md`.
    *   Update the progress of the completed task to 100% or mark it as complete.
    *   Move the task to the appropriate "completed" section if your dashboard has one.

2.  **Write a Brief Summary**:
    *   In the "SON ÇALIŞMA NOTLARI" (Last Work Session Notes) section, add a concise summary of what was accomplished.
    *   Include a link to the pull request if one was created.

3.  **Update "HIZLI İSTATİSTİKLER" (Quick Statistics)**:
    *   If the task completion affects project statistics (e.g., number of completed features, documentation pages updated), update the "HIZLI İSTATİSTİKLER" section.

4.  **Move Completed Tasks (if applicable)**:
    *   If the task was tracked in `docs/status/master-tasks.md`, move it to the relevant reports directory (e.g., `docs/reports/`) with a timestamp.

5.  **Create a Pull Request**:
    *   Push your changes to a feature branch.
    *   Open a pull request to the main branch.
    *   The PR title should clearly describe the atomic change (e.g., "Fix typo in user authentication guide").
    *   The PR description should explain the rationale for the change and link to any relevant tasks or issues.

## Roles & Responsibilities

*   **Developer/Author**: Responsible for breaking down work into atomic tasks, executing the change following the protocol, and updating all relevant documentation.
*   **Reviewer**: Responsible for ensuring that the pull request adheres to the atomic change principle and is focused on a single, clear objective.

## Timeline

*   **Preparation**: 5-10 minutes.
*   **Execution**: Varies depending on the task (from 30 minutes to a few hours).
*   **Post-Completion**: 5-10 minutes.
