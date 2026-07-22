# Test matrix

## Automated

| Area | Coverage |
| --- | --- |
| Connection URL | Encoding, TLS mode, invalid site and port rejection |
| Socket path | Expected Local layout and site-ID traversal rejection |
| Socket bridge | Real Unix-socket echo server through a loopback TCP client |
| Build/package | TypeScript build and `npm pack` contents in CI |
| Dependencies | Production dependency audit in CI |

## Manual validation

| Date | Local | macOS | TablePro | MySQL | Result |
| --- | --- | --- | --- | --- | --- |
| 2026-07-22 | 10.1.1 | macOS | 0.59.0 | 8.0.35 | Connected as `root@localhost` through the loopback bridge with TLS |

Before each public release, repeat the one-click install and connection flow on the current stable Local and TablePro versions. Test additional MySQL versions when suitable clean Local sites are available; do not claim compatibility that has not been exercised.
