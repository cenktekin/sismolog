---
description: "Action: Initiate and conduct a structured code review for a given pull request (PR) following project standards."
---
## Scope
- **Code Changes**: All modified files in the PR
- **Tests**: Unit, integration, and end-to-end tests
- **Documentation**: README, API docs, and relevant guides
- **Dependencies**: Any new or updated packages

## Prerequisites
- [ ] CI pipeline passed
- [ ] Branch is up-to-date with `main`
- [ ] PR description is complete with:
  - Purpose of changes
  - Screenshots (UI changes)
  - Testing steps
  - Related tickets/PRs

## Review Checklist

### 1. Code Quality
- [ ] Follows project patterns and conventions
- [ ] No commented-out code
- [ ] No debugging statements (console.log, debugger, etc.)
- [ ] Error handling is appropriate
- [ ] Logging is appropriate

### 2. Security
- [ ] No sensitive data in code/logs
- [ ] Input validation present
- [ ] Authentication/authorization checks
- [ ] Dependencies are up-to-date and secure

### 3. Performance
- [ ] No N+1 queries
- [ ] Efficient data structures
- [ ] Proper caching strategy
- [ ] Optimized asset loading

### 4. Testing
- [ ] Unit tests added/updated
- [ ] Test coverage meets threshold (min 80%)
- [ ] Edge cases covered
- [ ] Mocks/stubs used appropriately

### 5. Documentation
- [ ] Code is self-documenting
- [ ] Complex logic has comments
- [ ] Public APIs documented
- [ ] CHANGELOG.md updated if needed

## Review Process

### For Reviewers
1. **First Pass (15 min)**
   - Review PR description
   - Check test results
   - Scan for obvious issues

2. **Detailed Review**
   - Use GitHub's review feature
   - Group related comments
   - Be specific and constructive
   - Reference project standards when applicable

3. **Final Check**
   - All comments addressed
   - Tests pass
   - Documentation updated
   - No regression introduced

### For Authors
1. **Before Requesting Review**
   - Self-review your changes
   - Ensure tests pass
   - Update documentation

2. **After Review**
   - Address all comments
   - Push fixes as separate commits
   - Resolve conversations when addressed
   - Request re-review if needed

## Response Times
- **Urgent (P0)**: 2 hours
- **High Priority (P1)**: 4 hours
- **Normal (P2)**: 24 hours
- **Low (P3)**: 48 hours

## Approval
- Minimum 1 approval required
- All comments must be resolved
- CI must pass
- No open discussions

## Common Issues to Watch For
- Hardcoded values
- Magic numbers/strings
- Duplicate code
- Unused imports/variables
- Memory leaks
- Race conditions
- Security vulnerabilities

## Review Etiquette
- Be respectful and professional
- Explain the "why" behind suggestions
- Keep feedback constructive
- Acknowledge good patterns
- Use emojis for tone:
  - ✅ Looks good
  - ❓ Question
  - ⚠️ Concern
  - 🔍 Needs attention

## Post-Review
- Squash and merge when approved
- Delete the feature branch
- Update related tickets
- Notify relevant teams if needed
