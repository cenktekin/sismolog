---
description: "Action: Perform a controlled commit and push of the current project state to GitHub, ensuring all changes are ready and properly documented."
---

## Scope

This action is used to save the current progress of the project to the remote GitHub repository. It should be used after a logical unit of work is complete (e.g., after finishing a task, a set of atomic changes, or a documentation update).

*   **Saving Completed Work**: Committing features, bug fixes, or refactoring.
*   **Updating Documentation**: Committing changes to `docs/`, `.kiro/`, or other project files.
*   **Project Milestones**: Committing at the end of a sprint, phase, or significant achievement.
*   **Backup**: Creating a snapshot of the project state before making a large, experimental change.

## Objective

To reliably and safely commit and push changes to the main project repository on GitHub. This process ensures that all changes are intentional, well-documented, and that the remote repository reflects the current, stable state of the project. The process must:

*   **Review Changes**: Examine what has been modified before committing.
*   **Ensure Readiness**: Verify that the code and documentation are in a good state to be shared.
*   **Write Clear Commit Messages**: Document the "what" and "why" of the changes.
*   **Handle Branches**: Correctly manage commits on the correct branch (e.g., `main`, `develop`, or a feature branch).
*   **Update Project Status**: Reflect the commit in the project's dashboard and task tracking.

## Deliverables

1.  A new commit in the local Git repository.
2.  The commit pushed to the corresponding branch on the remote GitHub repository.
3.  The project's remote state is now in sync with the local state.
4.  Updated project status files (e.g., `PROJECT_DASHBOARD.md`) reflecting the successful commit.

## Process

### 1. Değişiklikleri İnceleme (Review Changes)

1.  **Check Git Status**:
    *   Open your terminal and run `git status`.
    *   This will show you which files have been modified, added, or deleted.
    *   Ensure that all the files listed are intended to be part of this commit.

2.  **Examine Diff**:
    *   Review the actual changes to understand their impact.
    *   For a summary of changes: `git --no-pager diff --stat`
    *   For a detailed view of unstaged changes: `git diff`
    *   For a detailed view of staged changes: `git diff --staged`
    *   To see the changes of a specific file: `git diff path/to/your/file.py`

3.  **Ensure Readiness**:
    *   **Code**: Is the code complete? Does it pass all tests (`bash scripts/run_tests.sh` or equivalent)? Is it free of obvious bugs or TODOs that should be addressed before committing?
   *   **Documentation**: Is all related documentation updated? Are links correct? Is the `PROJECT_DASHBOARD.md` and `master-tasks.md` updated?
   *   **Build**: Does the project build successfully if applicable?

### 2. Değişiklikleri Hazırlama (Stage Changes)

1.  **Stage All Relevant Changes**:
    *   To stage all changes: `git add .`
    *   To stage specific files: `git add path/to/file1.py path/to/file2.md`
    *   To stage all changes in a specific directory: `git add docs/`

2.  **Verify Staged Changes**:
    *   Run `git diff --staged` one last time to confirm that the staged changes are exactly what you want to commit.

### 3. Commit Mesajı Oluşturma (Create Commit Message)

1.  **Write a Clear and Informative Commit Message**:
    *   Follow a consistent commit message format. A common and effective format is **Conventional Commits**:
        ```
        <type>(<scope>): <description>

        [body]

        <footer>
        ```
    *   **`<type>`**: The type of change you're making. Common types include:
        *   `feat`: A new feature
        *   `fix`: A bug fix
        *   `docs`: Documentation only changes
        *   `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc.)
        *   `refactor`: A code change that neither fixes a bug nor adds a feature
        *   `perf`: A code change that improves performance
        *   `test`: Adding missing tests or correcting existing ones
        *   `chore`: Changes to the build process or auxiliary tools
        *   `build`: Changes that affect the build system or external dependencies
    *   **`(<scope>)`**: The scope of the change (e.g., `auth`, `api`, `docs`). Optional but recommended for clarity.
    *   **`<description>`**: A brief summary of the change (imperative mood, e.g., "add user authentication" not "added user authentication").
    *   **`[body]`**: A more detailed explanation of the change. Can include motivation, context, or breaking changes.
    *   **`<footer>`**: Information about Breaking Changes or issues closed.

2.  **Example Commit Messages**:
    *   `feat(auth): implement user login with JWT`
    *   `fix(api): resolve null pointer exception in user endpoint`
    *   `docs(readme): update installation instructions`
    *   `refactor(utils): simplify helper function for data validation`

3.  **Execute the Commit**:
    *   `git commit -m "feat(auth): implement user login with JWT"`
    *   For multi-line commit messages:
        ```bash
        git commit -m "feat(api): add new user registration endpoint

        - Implemented POST /api/register endpoint
        - Added input validation for email and password
        - Integrated with existing authentication service"
        ```

### 4. GitHub'a Gönderme (Push to GitHub)

1.  **Push to Remote Repository**:
    *   If you are on the correct branch (e.g., `main` or `develop`): `git push origin main`
    *   If you are on a feature branch: `git push origin feature-branch-name`

2.  **Handle Potential Push Issues**:
    *   **If the remote branch has diverged**: You may need to pull first. `git pull origin main --rebase` (rebase is often preferred to keep a linear history).
    *   **If you have permission issues**: Ensure you have the necessary write access to the repository and that your SSH key or credentials are correctly configured.

### 5. Proje Durumunu Güncelleme (Update Project Status)

1.  **Update `docs/status/PROJECT_DASHBOARD.md`**:
    *   In the "SON ÇALIŞMA NOTLARI" (Last Work Session Notes) section, add a new entry.
    *   Include a link to the commit on GitHub.
    *   Example: `* [DD/MM/YYYY] - Completed task: Implement user authentication. Commit: [link-to-github-commit]`

2.  **Update Task Status (if applicable)**:
    *   If this commit completes a task from `docs/status/master-tasks.md`, update its status to "Done" or 100%.

3.  **Update "HIZLI İSTATİSTİKLER" (Quick Statistics)**:
    *   If applicable, update project statistics like "Total Commits" or "Features Completed".

## Roles & Responsibilities

*   **Developer/Author**: Responsible for reviewing changes, staging them, writing a clear commit message, and pushing the changes.
*   **Project Lead/Reviewer**: May be responsible for reviewing commits before they are pushed, especially for sensitive or large changes.

## Timeline

*   **Review Changes**: 5-15 minutes.
*   **Stage and Commit**: 2-5 minutes.
*   **Push**: 1-5 minutes (depending on repository size and connection speed).
*   **Update Documentation**: 2-5 minutes.
*   **Total Estimated Time**: 10-30 minutes.
