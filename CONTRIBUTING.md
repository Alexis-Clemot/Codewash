## Documentation Standards: CONTRIBUTING.md

For any modification to this CONTRIBUTING.md file, follow these guidelines:

When editing this CONTRIBUTING.md file, please:

1. Write instructions that are direct, specific, and easy to follow. Avoid vague language.
2. Always add or update section headers for each new or changed contribution rule (e.g., "Commit norms", "Pull request norms").
3. Provide concrete examples for new rules or best practices, and update existing examples if the process changes.
4. Match the tone, formatting, and structure of the rest of the file. Use the same Markdown style, indentation, and list formatting.
5. For any major change (such as adding a new section or changing existing rules), open an issue or pull request and get team feedback before merging.
6. Use Markdown features like lists, tables, and code blocks to make guidelines easy to read and apply.
7. Ensure every contributor can understand and use the guidelines without needing extra explanation.

# CONTRIBUTING.md

---

## Technical Debt Norms

Follow these rules to document and manage technical debt in this project:

- **Be specific:** Clearly describe each debt item, including what it is, where it is found, and why it is a problem.
- **Categorize:** Assign each debt item to a category (e.g., code, architecture, documentation, testing, performance, dependencies).
- **Prioritize:** Indicate the impact and urgency of each debt item (High/Medium/Low).
- **Track with issues:** For significant debt, create a GitHub issue and link it in the debt documentation.
- **Describe impact:** Briefly explain how the debt affects maintainability, features, or user experience.
- **Suggest remediation:** Propose a solution or next step for each debt item if possible.
- **Keep up to date:** Update the debt list as you address or discover new debt. Remove items when resolved.

**Example Debt Table:**

| Area         | Description                                      | Impact   | Suggested Fix                | Issue # |
|--------------|--------------------------------------------------|----------|------------------------------|---------|
| Themes       | Hardcoded theme values in theme logic            | Medium   | Refactor to use config files | #12     |
| Bug Reports  | No screenshot upload in bug report modal         | High     | Add file upload support      | #15     |
| Performance  | Main menu sluggish on startup                    | High     | Optimize asset loading       | #18     |
| Testing      | No tests for translation feature                 | Medium   | Add unit tests               | #22     |

**How to update debt:**
- Add new debt items as you find them.
- Remove or update items as they are addressed.
- Reference related issues or pull requests when possible.
- Review the debt list regularly as part of project maintenance.

---

## Markdown Syntax Rules

Follow these Markdown syntax rules to keep documentation clear and consistent:

- Use `#` for main titles, `##` for section headers, and `###` for sub-sections.
	- Example:
		- `# Main Title`
		- `## Section Header`
		- `### Sub-section`
- Use `-` or `*` for bullet lists.
	- Example:
		- `- First item`
		- `- Second item`
- Use numbers for ordered lists.
	- Example:
		- `1. First step`
		- `2. Second step`
- Use triple backticks (```) for code blocks and single backticks for inline code.
	- Example:
		- Inline: ``Use `npm install` to add packages.``
		- Block:
			```
			npm install
			```
- Use `**bold**` or `*italic*` for emphasis.
- Use `[link text](url)` for links.

Keep formatting consistent throughout the documentation. Refer to this section if unsure about Markdown usage.

---

## Team Workflow Standards: Github norms

### GitHub Project & Issue Norms

- **Descriptive Titles and Labels:**
	- Issues should have concise, descriptive titles.
	- Use labels (e.g., `bug`, `enhancement`, `question`) to categorize and prioritize issues.
- **Reproducible Steps:**
	- Bug reports must include clear steps to reproduce the issue, expected vs. actual behavior, and environment details.
- **Respectful Communication:**
	- All interactions should be respectful and constructive.
	- Follow the project’s Code of Conduct at all times.
- **Linked Pull Requests:**
	- Reference issues in pull requests using keywords like `Fixes #123` to automatically close issues when merged.
- **Milestones and Projects:**
	- Use milestones to group issues for releases.
	- Use GitHub Projects (boards) for planning and tracking progress.
- **Contribution Guidelines:**
	- All contributors should follow these norms when creating or managing issues and pull requests.

### Commit norms

Follow these commit message conventions to ensure clarity and consistency:

**Format:**

```
<type>(<scope>): <short summary>

[optional body]
```

- **type**: The kind of change. Common types:
	- `Feat`: New feature
	- `Fix`: Bug fix
	- `Chore`: Maintenance, tooling, or non-user-facing changes
	- `Docs`: Documentation only changes
	- `Refactor`: Code change that neither fixes a bug nor adds a feature
	- `Dtyle`: Formatting, missing semi colons, etc. (no code change)
	- `Test`: Adding or updating tests
	- `Perf`: Performance improvement
	- `Ci`: Changes to CI/CD configuration
- **scope**: (Optional) The part of the codebase or docs affected (e.g., `ARCHITECTURE.md`, `docs/`, `api`, `ui`).
- **short summary**: Brief, imperative description of the change (max 72 characters).
- **body**: (Optional) More detailed explanation, motivation, or context.

**Examples:**

- `Feat(ARCHITECTURE.md, docs/): Added documentation for overall architecture and docs/ folder`
- `Fix(gameUtils): Corrected score calculation bug`
- `Chore: Updated dependencies and cleaned up scripts`
- `Refactor(components): Simplified ProfileCard logic`
- `Docs(README): Improved installation instructions`
- `Test(skills): Added tests for SkillCard component`
- `Style: Fixed ESLint warnings in main.jsx`
- `Ci: Update GitHub Actions workflow for Node 20`

### Pull request norms

- Clearly describe what the pull request changes and why.
- Reference related issues using keywords like `CLOSES #123` so they are automatically closed when merged.

Follow these commit message conventions to ensure clarity and consistency:


**Tips:**
- Use the imperative mood (e.g., "Add", not "Added" or "Adds").
- Reference issues or PRs when relevant (e.g., `Fixes #42`).
- Keep messages concise and meaningful.


## Documentation Standards: ARCHITECTURE.md

For any contribution to the architecture documentation, follow this structure:

1. **Purpose & Scope**: Briefly explain the purpose of the project and the scope of the document.
2. **System Overview**: Summarize the overall functioning of the system and its main objectives.
3. **Key Requirements & Constraints**: List the major requirements and any technical or business constraints.
4. **High-Level Architecture Diagram**: Add a C4 (Context/Container) diagram or a Mermaid diagram.
5. **Main Components & Responsibilities**: Table listing each component and its role.
6. **Data Flow / Key Interactions**: Describe the main data flows or interactions (diagram recommended).
7. **Technologies & Tools Used**: List the main frameworks, libraries, and tools.
8. **Deployment Overview**: Explain how and where the system is deployed (Docker, cloud, etc.).
9. **Quality Attributes**: Detail the expected qualities (scalability, security, maintainability, performance).
10. **Glossary (optional)**: Define important terms or acronyms.

Respect the order and clarity of each section. Use Markdown, tables, and Mermaid diagrams for readability.

---

## Documentation Standards: README.md

For any modification to the README, follow the existing structure:

1. Project presentation and objectives
2. Installation and launch instructions (with prerequisites)
3. Available scripts (table)
4. Code architecture (tree + explanations)
5. Tests (rules, coverage, commands)
6. Known technical debt (table)

**Tips:**
- Keep a clear, educational, and concise tone.
- Update command examples if needed.
- Add explanations for any new feature or major change.
- Use tables and lists for clarity.

---


## Documentation Standards: CHANGELOGS.md

For any modification to the CHANGELOGS.md file, follow these guidelines:

1. **Chronological Order**: List the latest changes at the top of the file.
2. **Versioning**: Use semantic versioning (e.g., [1.2.0]) and include the release date (YYYY-MM-DD).
3. **Sections per Release**: For each version, use clear sections such as "Added" (new features), "Changed" (updates or improvements), "Fixed" (bug fixes), "Removed" (features or code removed), and any other relevant types (e.g., "Deprecated", "Security").
4. **Conciseness**: Write short, clear, and actionable change descriptions.
5. **Formatting**: Use Markdown headers and lists for readability.
6. **Consistency**: Follow the format and tone of previous entries.
7. **Attribution**: Major changes should reference related issues or pull requests if applicable.
8. **No Breaking Changes Without Notice**: Clearly highlight any breaking changes.
9. **Review**: Discuss major or controversial changes with the team before merging.


**Example:**

```
## [1.2.0] - 2026-04-01
### Added
- New feature: user authentication
### Changed
- Updated dependencies
### Fixed
- Resolved crash on startup
### Removed
- Deprecated legacy login system
### Security
- Patched XSS vulnerability in profile page
```

---



---

## General Best Practices

- Contributions must respect the structure and consistency of existing documents.
- Any major change should be discussed via an issue or pull request.
- Diagrams should be in Mermaid or as SVG/PNG images placed in `docs/` or `public/assets/`.
- Technical terms should be defined in the glossary if ambiguous.
