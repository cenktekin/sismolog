---
description: "Action: Intelligent next task determination through rapid project assessment, documentation analysis, and priority-based task selection."
---

## Scope

This action combines rapid project assessment with intelligent task prioritization to determine the most logical next development task. It covers:

*   **Rapid Project Assessment**: Quick analysis of current project state, active tasks, and recent progress.
*   **Documentation Health Check**: Verification that documentation aligns with current codebase and project status.
*   **Task Priority Analysis**: Evaluation of pending tasks based on dependencies, criticality, and project phase.
*   **Context-Aware Recommendations**: Smart suggestions based on project momentum, team capacity, and strategic goals.

## Objective

To efficiently determine the next most valuable development task by:

*   **Assessing Current State**: Understanding where the project stands and what was last accomplished.
*   **Identifying Blockers**: Finding any impediments that need immediate attention.
*   **Evaluating Options**: Analyzing available tasks based on priority, dependencies, and effort.
*   **Making Smart Recommendations**: Suggesting the optimal next task with clear rationale.
*   **Ensuring Continuity**: Maintaining project momentum and avoiding context switching overhead.

## Deliverables

1.  **Project State Summary**: Current status, recent achievements, and active work streams.
2.  **Priority Task List**: Top 3-5 candidate tasks with priority scores and rationale.
3.  **Recommended Next Task**: Single highest-priority task with detailed justification.
4.  **Execution Plan**: Clear steps to begin the recommended task, including prerequisites and success criteria.
5.  **Risk Assessment**: Potential blockers and mitigation strategies for the recommended task.

## Process

### Phase 1: Rapid Project Assessment (3 minutes)

#### Step 1: Dashboard Analysis (1 minute)
1.  **Read `docs/status/PROJECT_DASHBOARD.md`**:
    *   Parse current project phase and overall progress
    *   Identify any critical issues (ACİL DURUM section)
    *   Note active tasks and their completion status
    *   Review recent work session notes

2.  **Quick Status Check**:
    *   Overall project health (green/yellow/red)
    *   Current sprint or phase status
    *   Any emergency items requiring immediate attention

#### Step 2: Context Building (2 minutes)
1.  **Review Core Documentation**:
    *   `docs/status/DEVELOPMENT_STATUS.md` - Detailed project status
    *   `docs/status/master-tasks.md` - Complete task inventory
    *   Recent completion reports in `docs/reports/`

2.  **Assess Documentation Health**:
    *   Check for stale or conflicting information
    *   Verify alignment between dashboard and detailed status
    *   Identify any documentation gaps that might impact development

3.  **Analyze Recent Progress**:
    *   What was completed in the last session?
    *   What momentum can be maintained?
    *   Are there any incomplete tasks that need finishing?

### Phase 2: Task Analysis & Prioritization (4 minutes)

#### Step 3: Task Discovery (2 minutes)
1.  **Identify Candidate Tasks**:
    *   Incomplete tasks from current sprint/phase
    *   Next logical tasks in the project roadmap
    *   Critical bugs or issues that need addressing
    *   Documentation or infrastructure improvements

2.  **Dependency Analysis**:
    *   Which tasks are unblocked and ready to start?
    *   What tasks depend on recently completed work?
    *   Are there any prerequisite tasks that need completion first?

#### Step 4: Priority Scoring (2 minutes)
For each candidate task, evaluate:

1.  **Business Impact** (1-5 scale):
    *   How critical is this task for project success?
    *   Does it unblock other important work?
    *   Is it on the critical path for delivery?

2.  **Technical Readiness** (1-5 scale):
    *   Are all dependencies satisfied?
    *   Is the task well-defined with clear acceptance criteria?
    *   Are the required resources and tools available?

3.  **Effort vs. Value** (1-5 scale):
    *   What's the estimated effort required?
    *   How much value will be delivered?
    *   Is this the best use of available time?

4.  **Context Continuity** (1-5 scale):
    *   Does this build on recent work?
    *   Will it maintain current momentum?
    *   Does it align with the current focus area?

### Phase 3: Recommendation & Planning (3 minutes)

#### Step 5: Task Selection (1 minute)
1.  **Calculate Priority Scores**:
    *   Total score = (Business Impact × 2) + Technical Readiness + (Effort vs. Value × 1.5) + Context Continuity
    *   Rank tasks by total score

2.  **Apply Strategic Filters**:
    *   Prefer tasks that advance the current phase/sprint
    *   Avoid context switching unless critical
    *   Consider team capacity and expertise

#### Step 6: Execution Planning (2 minutes)
1.  **Define Success Criteria**:
    *   What constitutes completion of this task?
    *   What deliverables are expected?
    *   How will success be measured?

2.  **Identify Prerequisites**:
    *   What needs to be done before starting?
    *   Are there any tools or resources needed?
    *   Who needs to be consulted or informed?

3.  **Risk Mitigation**:
    *   What could go wrong?
    *   What are the backup plans?
    *   How can risks be minimized?

## Decision Framework

### Task Priority Matrix

| Priority Level | Criteria | Action |
|---------------|----------|---------|
| **P0 - Critical** | Blocking production, security issues, critical bugs | Start immediately |
| **P1 - High** | Sprint goals, unblocking other work, major features | Start within current session |
| **P2 - Medium** | Important but not urgent, quality improvements | Schedule for next session |
| **P3 - Low** | Nice-to-have, technical debt, minor enhancements | Backlog for future sprints |

### Context Switching Guidelines

**Avoid context switching when:**
*   Current task is >50% complete
*   Recent work can be extended or built upon
*   Team is in a productive flow state

**Consider context switching when:**
*   Critical issues arise (P0 priority)
*   Current task is blocked by external dependencies
*   New information significantly changes priorities

### Documentation Alignment Checks

**Red Flags** (require immediate attention):
*   Dashboard shows different status than detailed docs
*   Recent work not reflected in documentation
*   Broken links or references in critical docs
*   Missing documentation for new features

**Yellow Flags** (address when convenient):
*   Minor inconsistencies in documentation
*   Outdated examples or screenshots
*   Missing or incomplete API documentation

## Output Format

### Recommended Task Report

```markdown
# Next Task Recommendation

## Project Status Summary
- **Current Phase**: [Phase name and progress]
- **Recent Achievement**: [Last completed task/milestone]
- **Overall Health**: [Green/Yellow/Red with brief explanation]

## Recommended Next Task
**Task**: [Task ID and name]
**Priority Score**: [X/20] (Business: X, Technical: X, Value: X, Context: X)
**Estimated Effort**: [Time estimate]
**Expected Value**: [Brief description of benefits]

## Rationale
[2-3 sentences explaining why this task was selected]

## Execution Plan
1. **Prerequisites**: [What needs to be done first]
2. **Success Criteria**: [How to know when it's complete]
3. **Key Steps**: [3-5 main steps to complete the task]
4. **Potential Risks**: [Main risks and mitigation strategies]

## Alternative Tasks
1. **[Task 2]**: [Brief description and why it wasn't selected]
2. **[Task 3]**: [Brief description and why it wasn't selected]

## Documentation Actions Needed
- [Any documentation updates required]
- [Links that need fixing]
- [New documentation to create]
```

## Roles & Responsibilities

*   **AI Assistant/Developer**: Executes the assessment process, analyzes options, and provides recommendations.
*   **Project Lead**: Provides strategic context and validates recommendations against business priorities.
*   **Technical Lead**: Validates technical feasibility and dependency analysis.
*   **Product Owner**: Confirms business value assessment and priority alignment.

## Timeline

*   **Phase 1 - Assessment**: 3 minutes
*   **Phase 2 - Analysis**: 4 minutes  
*   **Phase 3 - Recommendation**: 3 minutes
*   **Total Duration**: 10 minutes maximum

## Success Metrics

*   **Decision Speed**: Recommendation provided within 10 minutes
*   **Accuracy**: Recommended task aligns with project goals and is technically feasible
*   **Value**: Selected task delivers meaningful progress toward project objectives
*   **Continuity**: Maintains project momentum and minimizes context switching
*   **Documentation Health**: Any critical documentation issues identified and flagged

## Integration with Existing Commands

This command builds upon and can trigger:
*   **project-assessment.md**: For detailed project state analysis
*   **update-docs.md**: When documentation issues are identified
*   **task-breakdown.md**: When selected task needs to be broken into sub-tasks
*   **atomic-change.md**: For implementing the recommended task

## Example Usage Scenarios

1.  **Sprint Planning**: Determine the next task to work on during a sprint
2.  **Context Switching**: Decide whether to continue current work or switch to something more urgent
3.  **Team Handoff**: Help new team members understand what to work on next
4.  **Unblocking**: Find alternative tasks when current work is blocked
5.  **Priority Clarification**: Resolve conflicts between multiple high-priority tasks

---

*This command is designed to be the primary decision-making tool for development task selection, combining rapid assessment with intelligent prioritization to maximize development velocity and project success.*