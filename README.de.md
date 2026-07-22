# Local TablePro

Ein Community-Add-on für Local unter macOS, das die MySQL-Datenbank einer laufenden Local-WordPress-Site mit einem Klick in [TablePro](https://tablepro.app/) öffnet.

Das Projekt überträgt den Workflow von [`aubreypwd/local-tableplus`](https://github.com/aubreypwd/local-tableplus) auf TablePro. Weil TablePro in einer Verbindungs-URL keinen beliebigen MySQL-Unix-Socket auswählen kann, erstellt das Add-on eine kurzlebige, ausschließlich an `127.0.0.1` gebundene TCP-Brücke zum Socket der ausgewählten Site.

## Voraussetzungen

- macOS 14 oder neuer
- Local 10 oder neuer
- TablePro in `/Applications`, `/Applications/Setapp` oder `~/Applications`
- eine gestartete Local-Site mit MySQL

## Installation und Nutzung

1. `local-tablepro-1.1.0.tgz` aus dem [aktuellen Release](https://github.com/electricarts/local-tablepro/releases/latest) laden.
2. In Local **Add-ons → Installed → Install from Disk** öffnen.
3. Das Archiv auswählen, **TablePro** aktivieren und Local neu starten.
4. Eine Site starten, deren Reiter **Database** öffnen und **Open TablePro** anklicken.

Falls **Install from Disk** fehlt, das Archiv nach `~/Library/Application Support/Local/addons/local-tablepro` entpacken und Local neu starten.

## Sicherheit und Datenschutz

Die Brücke läuft in Locals Hintergrundprozess, erhält einen freien Port und ist nicht aus dem Netzwerk erreichbar. Der sichtbare Add-on-Teil kann nur eine validierte Local-Site-ID, aber keinen beliebigen Dateipfad übergeben. Beim Stoppen der Site oder Beenden von Local wird die Brücke geschlossen.

TablePro wird ohne Shell gezielt über `com.TablePro` gestartet; dynamische URL-Felder werden percent-kodiert. Das Add-on protokolliert oder speichert die für die Verbindung benötigten Zugangsdaten nicht und sendet sie an keinen Internetdienst. `sslmode=require` unterstützt MySQL 8 mit `caching_sha2_password`.

Weitere Informationen stehen in [README.md](README.md), [PRIVACY.md](PRIVACY.md), [SECURITY.md](SECURITY.md) und [SUPPORT.md](SUPPORT.md).

## Lizenz

GPL-3.0-only. Siehe [LICENSE](LICENSE).
