# Local TablePro

[![CI](https://github.com/electricarts/local-tablepro/actions/workflows/ci.yml/badge.svg)](https://github.com/electricarts/local-tablepro/actions/workflows/ci.yml)
[![Latest release](https://img.shields.io/github/v/release/electricarts/local-tablepro)](https://github.com/electricarts/local-tablepro/releases/latest)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A community add-on for [Local](https://localwp.com/) on macOS. It opens the database of a running Local WordPress site in [TablePro](https://tablepro.app/) with one click.

Version 2 is an independent implementation built from the documented Local Add-on API and TablePro's public URL interface. Because TablePro connection URLs cannot select an arbitrary MySQL Unix socket, the add-on creates a short-lived TCP bridge bound exclusively to `127.0.0.1` and forwards it to the selected site's Local socket. See [implementation provenance](docs/INDEPENDENT-REIMPLEMENTATION.md) and [license history](docs/LICENSE_HISTORY.md).

Deutsch: [README.de.md](README.de.md)

## Requirements

- macOS 14 or later (TablePro requirement)
- Local 10 or later
- [TablePro](https://tablepro.app/download) installed in `/Applications`, `/Applications/Setapp`, or `~/Applications`
- A running Local site using MySQL

## Install

1. Download the `.tgz` file from the [latest release](https://github.com/electricarts/local-tablepro/releases/latest).
2. In Local, open **Add-ons → Installed → Install from Disk**.
3. Select the `.tgz` file, enable **TablePro**, and restart Local.

If your Local version does not offer **Install from Disk**, extract the archive to:

```text
~/Library/Application Support/Local/addons/local-tablepro
```

Then restart Local and enable the add-on under **Add-ons → Installed**.

## Use

1. Start a site in Local.
2. Open its **Database** tab.
3. Click **Open TablePro**.
4. Approve TablePro's connection prompt on first use.

The button remains disabled if the site is stopped, TablePro is not found, or Local is not running on macOS.

## Security and privacy

The main process creates a loopback-only bridge on an operating-system-assigned port and forwards the bytes unchanged to the site's MySQL Unix socket. The renderer may request a bridge only for a validated Local site ID; it cannot supply a filesystem path. The bridge is closed when the site stops or Local exits.

TablePro is launched directly through its bundle ID without a shell. Dynamic URL fields are percent-encoded. MySQL credentials are required in the connection URL, but this add-on does not log, persist, or transmit them to an internet service. `sslmode=require` supports MySQL 8 `caching_sha2_password` without allowing an RSA-key exchange over an unencrypted client connection. See [PRIVACY.md](PRIVACY.md) and [SECURITY.md](SECURITY.md).

## Development

```bash
git clone https://github.com/electricarts/local-tablepro.git
cd local-tablepro
npm ci
npm test
npm run link
```

Restart Local after linking. `npm run build` compiles `src/` into `lib/`; `npm run unlink` removes only the symlink created by the link script.

Build an installable archive with:

```bash
npm run release
```

The archive is written to `dist/local-tablepro-2.0.0.tgz`.

## Troubleshooting

- **Disabled button:** Start the site, check a supported TablePro installation path, then restart Local.
- **Connection error:** Restart the site so Local recreates its MySQL socket, then try again.
- **Nothing appears:** Start TablePro once manually, then inspect Local's developer tools for `[local-tablepro]` messages.

For more help, read [SUPPORT.md](SUPPORT.md) or [open an issue](https://github.com/electricarts/local-tablepro/issues/new/choose).

## License

MIT for version 2 and later. Releases through 1.1.2 remain GPL-3.0-only. See [LICENSE](LICENSE) and [license history](docs/LICENSE_HISTORY.md).

TablePro and Local are independent products and trademarks of their respective owners. This community add-on is not affiliated with or endorsed by either project.
