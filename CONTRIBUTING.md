## Documentation Standards: CONTRIBUTING.md

For any modification to this CONTRIBUTING.md file, follow these guidelines:

1. Keep instructions clear, concise, and actionable.
2. Use section headers for each type of contribution norm (e.g., architecture, README, code style).
3. Update examples and best practices as the project evolves.
4. Ensure all documentation is consistent in tone and format with the rest of the file.
5. Discuss major changes with the team via issue or pull request before merging.

Use Markdown formatting, lists, and tables for clarity. All contributors should be able to easily understand and apply the guidelines.

# CONTRIBUTING.md

---

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
