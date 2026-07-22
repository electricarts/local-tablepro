# Local TablePro

Ein Local-Add-on für macOS, das die MySQL-Datenbank einer laufenden Local-WordPress-Site mit einem Klick in [TablePro](https://tablepro.app/) öffnet.

Das Projekt ist eine auf TablePro übertragene und technisch bereinigte Variante von [`aubreypwd/local-tableplus`](https://github.com/aubreypwd/local-tableplus). Es verwendet weiterhin den offiziellen Local-Content-Hook, verbindet aber über den von Local bereitgestellten TCP-Port. Dadurch muss `/tmp/mysql.sock` weder gelöscht noch als symbolischer Link verändert werden.

## Voraussetzungen

- macOS 14 oder neuer (Voraussetzung von TablePro)
- [Local](https://localwp.com/) 5.0 oder neuer
- [TablePro](https://tablepro.app/download) in `/Applications`, `/Applications/Setapp` oder `~/Applications`
- eine gestartete Local-Site mit MySQL

## Installation des fertigen Pakets

1. Lade die Datei `local-tablepro-1.0.0.tgz` aus dem Release-Ordner herunter.
2. Öffne in Local **Add-ons → Installed → Install from Disk**.
3. Wähle die `.tgz`-Datei aus.
4. Aktiviere **TablePro** und starte Local neu.

Falls **Install from Disk** in deiner Local-Version nicht angeboten wird, entpacke das Archiv und kopiere den Ordner nach:

```text
~/Library/Application Support/Local/addons/local-tablepro
```

Starte Local danach neu und aktiviere das Add-on unter **Add-ons → Installed**.

## Nutzung

1. Starte die gewünschte Site in Local.
2. Öffne den Reiter **Database**.
3. Klicke **Open TablePro**.
4. Bestätige beim ersten Aufruf den von TablePro angezeigten Verbindungsdialog. Für Loopback-Verbindungen kann TablePro die Freigabe auf Wunsch merken.

Der Button ist deaktiviert, wenn die Site gestoppt ist, kein gültiger MySQL-Port vorhanden ist, TablePro nicht an einem der unterstützten Orte gefunden wird oder Local nicht unter macOS läuft.

## Funktionsweise und Sicherheit

Das Add-on erstellt eine standardkonforme URL dieser Form:

```text
mysql://USER:PASSWORD@127.0.0.1:PORT/DATABASE?name=SITE&env=local&safeModeLevel=0
```

Alle dynamischen Bestandteile werden percent-kodiert. TablePro wird gezielt über seine Bundle-ID gestartet:

```text
/usr/bin/open -b com.TablePro <URL>
```

Die Argumente werden ohne Shell an `open` übergeben. Dadurch können Site-Namen oder Zugangsdaten keine Shell-Befehle einschleusen, und ein anderes Programm wie TablePlus kann den `mysql://`-Link nicht abfangen.

Die MySQL-Zugangsdaten müssen für eine direkte Verbindung Teil der URL sein. Sie werden nicht protokolliert, nicht dauerhaft vom Add-on gespeichert und nicht an einen Netzwerkdienst gesendet. TablePro zeigt externe Verbindungen vor dem Öffnen zur Bestätigung an.

## Entwicklung

```bash
git clone <deine-repository-url> local-tablepro
cd local-tablepro
npm install
npm test
npm run link
```

Nach `npm run link` Local neu starten. Während der Entwicklung kompiliert `npm run build` die Dateien aus `src/` nach `lib/`. `npm run unlink` entfernt ausschließlich den vom Link-Skript angelegten symbolischen Link.

Ein installierbares Archiv wird mit folgendem Befehl erzeugt:

```bash
npm run release
```

Das Ergebnis liegt anschließend unter `dist/local-tablepro-1.0.0.tgz`.

## Fehlerbehebung

**Der Button ist ausgegraut**

- Site in Local starten.
- Prüfen, ob TablePro als `TablePro.app` in `/Applications`, `/Applications/Setapp` oder `~/Applications` liegt.
- Local nach Installation oder Aktivierung des Add-ons neu starten.

**TablePro meldet einen Verbindungsfehler**

- Site stoppen und neu starten, damit Local den MySQL-Port neu bereitstellt.
- Im Database-Reiter prüfen, ob Local Host, Port und Zugangsdaten anzeigt.
- Eine Firewall- oder Netzwerkfilter-Regel für Loopback-Verbindungen prüfen.

**Ein Klick hat keine sichtbare Wirkung**

- TablePro einmal manuell starten.
- In Local **View → Toggle Developer Tools** öffnen und nach Meldungen mit `[local-tablepro]` suchen.

## Lizenz

GPL-3.0-only. Siehe [LICENSE](LICENSE).

TablePro und Local sind eigenständige Projekte und Marken ihrer jeweiligen Rechteinhaber. Dieses Community-Add-on ist nicht offiziell mit ihnen verbunden.
