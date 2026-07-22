# Local TablePro 1.1.0

First public, submission-ready release.

- Opens a running Local site's database directly in TablePro.
- Uses a loopback-only TCP bridge to Local's MySQL Unix socket.
- Runs the bridge in Local's main process and restricts requests to validated site IDs.
- Supports MySQL 8 authentication through a TLS-required TablePro connection.
- Includes English and German documentation, tests, CI, privacy and security policies.

Install `local-tablepro-1.1.0.tgz` through **Local → Add-ons → Installed → Install from Disk**, enable the add-on, and restart Local.
