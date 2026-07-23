# Local Add-on submission

The official submission endpoint is [localwp.com/submit-addon](https://localwp.com/submit-addon/). Local's current documentation confirms that add-ons use its JavaScript API and that `SiteInfoDatabase_TableList_TableListRow[Connect]:Before` is a supported content hook.

## Submission copy

- **Name:** TablePro
- **Slug/package:** `local-tablepro`
- **Author:** Mario Peischl / electricarts
- **Repository:** https://github.com/electricarts/local-tablepro
- **Release:** https://github.com/electricarts/local-tablepro/releases/latest
- **License:** MIT (version 2 and later)
- **Platforms:** macOS 14 or later
- **Minimum Local version:** 10.0.0
- **External requirement:** TablePro
- **Short description:** Open the database of a running Local WordPress site in TablePro with one click.
- **Support:** https://github.com/electricarts/local-tablepro/issues

## Suggested long description

Local TablePro adds an “Open TablePro” action to the Database tab of each Local site. It launches the installed TablePro app with the selected site's database credentials. A loopback-only bridge in Local's main process forwards the connection to the site's MySQL Unix socket, preserving `root@localhost` authentication without changing MySQL users or grants. The bridge accepts no network connections beyond the Mac itself and closes with the site or Local. The project is open source, contains no analytics, and sends no data to an internet service.

## Maintainer checklist

- [x] Public source repository with an OSI-compatible license
- [x] Current installable `.tgz` release
- [x] Unique package name and slug
- [x] Main and renderer entry points
- [x] Supported Local content hook
- [x] English installation and usage documentation
- [x] Privacy, security, support, contribution, and conduct policies
- [x] Automated tests, package-content verification, dependency audit, and release workflow
- [x] Issue and pull-request templates
- [ ] Repeat manual validation for the independent v2 implementation
- [x] No telemetry, remote service, database mutation, or shell interpolation
- [ ] Submit the official form (requires the maintainer's consent and any personal contact fields requested by Local)
- [ ] Respond to Local's review feedback and publish any requested revisions

The final two items happen after repository preparation and cannot be completed by code alone.
