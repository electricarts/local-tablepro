# Test matrix

## Automated

| Area | Coverage |
| --- | --- |
| Connection URL | Encoding, TLS mode, invalid site and port rejection |
| Socket path | Expected Local layout and site-ID traversal rejection |
| Socket bridge | Real Unix-socket echo server through a loopback TCP client |
| Build/package | TypeScript build and `npm pack` contents in CI |
| Dependencies | Production dependency audit in CI |

The v2 suite additionally validates typed request parsing, path confinement, supported application locations, bridge reuse, and end-to-end byte forwarding.

## Manual validation

| Date | Local | macOS | TablePro | MySQL | Result |
| --- | --- | --- | --- | --- | --- |
| 2026-07-22 | 10.1.1 | macOS | 0.59.0 | 8.0.35 | Connected as `root@localhost` through the loopback bridge with TLS |
| 2026-07-23 | 10.1.1 | macOS | 0.55.0 | 8.0.35 | v2 installed successfully; displayed tables after one-click launch, opened a fresh working connection after site stop/start, and selected the requested site reliably with three sites active |

The 2026-07-22 result applies to the GPL-licensed 1.x implementation. The 2026-07-23 result validates the independently rewritten v2 implementation. The optional missing-application test was skipped to avoid uninstalling the user's working TablePro installation; application discovery and unavailable-state handling remain covered by automated tests.

Before each public release, repeat the one-click install and connection flow on the current stable Local and TablePro versions. Test additional MySQL versions when suitable clean Local sites are available; do not claim compatibility that has not been exercised.
