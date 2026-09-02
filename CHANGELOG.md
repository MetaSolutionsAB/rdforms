# Release notes - RDForms

All notable changes to the RDForms project will be documented in this file. This project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [10.18.0](https://bitbucket.org/metasolutions/rdforms/branches/compare/10.18.0%0D10.17.0) - 2026-09-02

The React renderer now targets MUI 9 (`@mui/material`, `@mui/icons-material` and `@mui/x-date-pickers` `^9`) and
supports React 18 and 19. React, MUI and emotion are declared as optional peer dependencies, so consumers that only
use the bootstrap or vanilla flavors no longer need to install them.

### New Feature

- [RDFORMS-163](https://metasolutions.atlassian.net/browse/RDFORMS-163) New vanilla presentation flavor with simplified semantic HTML and opt-in CSS

### Improvement

- [RDFORMS-216](https://metasolutions.atlassian.net/browse/RDFORMS-216) Make MUI an optional peer dependency and migrate the React renderer to MUI 9
- [RDFORMS-209](https://metasolutions.atlassian.net/browse/RDFORMS-209) Add Today/Now shortcuts and a year view to the React date and time pickers
- [RDFORMS-166](https://metasolutions.atlassian.net/browse/RDFORMS-166) Tag rendered text with `lang` when its resolved language differs from the page locale
- [RDFORMS-189](https://metasolutions.atlassian.net/browse/RDFORMS-189) Tag `lang` on all localized value rendering that falls back to a non-locale language
- [RDFORMS-190](https://metasolutions.atlassian.net/browse/RDFORMS-190) Tag `lang` on radio and checkbox editor choice labels
- [RDFORMS-173](https://metasolutions.atlassian.net/browse/RDFORMS-173) Port legacy DOH/Dojo unit tests to Jest
- [RDFORMS-174](https://metasolutions.atlassian.net/browse/RDFORMS-174) Adopt the shared ESLint config, apply formatting and fix outstanding lint errors
- [RDFORMS-175](https://metasolutions.atlassian.net/browse/RDFORMS-175) Fix React-tree lint findings surfaced by enabling JSX linting
- [RDFORMS-179](https://metasolutions.atlassian.net/browse/RDFORMS-179) Raise unit-test coverage for the core model/template classes
- [RDFORMS-180](https://metasolutions.atlassian.net/browse/RDFORMS-180) Lint changed files before committing

### Bug

- [RDFORMS-165](https://metasolutions.atlassian.net/browse/RDFORMS-165) Non-interactive section headings no longer receive focus and `role="button"`
- [RDFORMS-176](https://metasolutions.atlassian.net/browse/RDFORMS-176) Break the circular dependency between model/system.js and utils.js
- [RDFORMS-177](https://metasolutions.atlassian.net/browse/RDFORMS-177) Fix latent ReferenceError and dead-branch bugs surfaced by ESLint
- [RDFORMS-178](https://metasolutions.atlassian.net/browse/RDFORMS-178) Fix React image presenter crash caused by a `getGixt` typo
- [RDFORMS-182](https://metasolutions.atlassian.net/browse/RDFORMS-182) Sanitize href/src URI schemes in view presenters (javascript: link injection)
- [RDFORMS-187](https://metasolutions.atlassian.net/browse/RDFORMS-187) Keep bootstrap labels non-focusable when the description resolves empty for the active locale
- [RDFORMS-219](https://metasolutions.atlassian.net/browse/RDFORMS-219) Fix removing a row in the bootstrap table view

### Task

- [RDFORMS-185](https://metasolutions.atlassian.net/browse/RDFORMS-185) Vanilla flavor: native details/summary value truncation
