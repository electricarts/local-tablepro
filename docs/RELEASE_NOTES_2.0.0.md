# Local TablePro 2.0.0

Version 2 replaces the version 1 implementation with a new TypeScript codebase based on the public Local Add-on API and TablePro URL behavior.

- New functional React action and typed IPC boundary.
- New main-process availability checks and TablePro launcher.
- New loopback bridge pool with per-site lifecycle management.
- New path and request validation.
- New tests, build cleanup, development-linking tool, and project configuration.
- MIT licensing for the version 2 implementation; versions through 1.1.2 remain GPL-3.0-only.

The stable release was manually validated with Local 10.1.1 and MySQL 8.0.35. The checks covered installation from the packaged archive, successful database access with visible tables, reconnection after stopping and restarting a site, and correct selection with three Local sites running simultaneously.
