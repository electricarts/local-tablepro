# Independent reimplementation record

## Scope

Version 2 replaces all runtime source files, tests, TypeScript configuration, editor configuration, ignore rules, and development-linking scripts from versions 1.x. It preserves only the product requirements, package identity, artwork, public documentation, and the Local API hook required to place an action in the Database screen.

## Inputs used

The implementation was written from these functional and public-interface facts:

- Local exposes main and renderer add-on entry points.
- Local documents `SiteInfoDatabase_TableList_TableListRow[Connect]:Before` as the Database connect content hook.
- Local exposes its user-data and home paths through the add-on context.
- A running Local MySQL service exposes a Unix socket beneath Local's per-site runtime directory.
- TablePro accepts MySQL connection URLs and can be launched by its macOS bundle identifier.
- The requested behavior, security properties, UI label, supported installation locations, and confirmed MySQL 8 TLS behavior were supplied and validated during this project's development.

No source file from version 1.x was retained in the version 2 runtime. The new design uses a typed request protocol, a functional React component, a main-process application launcher, and a separately modeled loopback bridge pool.

## Important limitation

This is a from-scratch code replacement, not a formally certified clean-room process. The implementer had previously inspected the 1.x and `aubreypwd/local-tableplus` sources. An independent legal or code-provenance review is recommended before representing version 2 as a legally clean-room implementation.

## Verification

Reviewers can compare this branch to tag `v1.1.2`. Every file below is deleted or replaced:

- `src/`
- `test/`
- `tsconfig.json`
- `.editorconfig`
- `.eslintrc`
- `.gitignore`
- `.npmignore`
- `npm/scripts/`

Automated tests cover input validation, URL construction, path confinement, supported TablePro locations, bridge reuse, and byte transport between a loopback TCP client and a temporary Unix socket.
