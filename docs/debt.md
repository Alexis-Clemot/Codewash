# Technical Debt

This document tracks known technical debt in the project. Use it to record, prioritize, and address areas that need improvement.

## Debt Documentation Norms

- **Be specific:** Clearly describe each debt item, where it is, and why it matters.
- **Categorize:** Use categories like code, architecture, documentation, testing, performance, dependencies, etc.
- **Prioritize:** Indicate impact and urgency (High/Medium/Low).
- **Track with issues:** Link to GitHub issues for major debt items.
- **Describe impact:** Briefly explain how the debt affects the project.
- **Suggest remediation:** Propose a solution or next step if possible.
- **Keep up to date:** Update this file as debt is added or resolved.

## Current Technical Debt

| Area         | Description                                      | Impact   | Suggested Fix                | Issue # |
|--------------|--------------------------------------------------|----------|------------------------------|---------|
| Themes       | Hardcoded theme values in theme logic            | Medium   | Refactor to use config files | #17     |
| Bug Reports  | No screenshot upload in bug report modal         | High     | Add file upload support      | #15     |
| Performance  | Main menu sluggish on startup                    | High     | Optimize asset loading       | #14     |
| Testing      | No tests for translation feature                 | Medium   | Add unit tests               | #16     |
| Architecture | Some modules have unclear responsibilities       | Medium   | Refactor and document        | #13     |
| Docs         | README lacks troubleshooting section             | Low      | Add troubleshooting guide    | #2      |
| Extensibility| Adding new games is not streamlined; requires manual integration in multiple places | High | Refactor game registration to use a plugin/config system and document the process | #7, #18 |

## How to Update

- Add new debt items as you find them.
- Remove or update items as they are addressed.
- Reference related issues or pull requests when possible.
- Review this file regularly as part of project maintenance.
