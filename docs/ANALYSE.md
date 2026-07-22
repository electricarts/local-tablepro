# Analyse und technische Entscheidungen

Stand: 22. Juli 2026

## Ausgangsprojekt

Analysiert wurde [`aubreypwd/local-tableplus`](https://github.com/aubreypwd/local-tableplus), `master` auf Commit `436444c`, Release `v1.1.0`.

Das Add-on:

1. registriert den Local-Content-Hook `SiteInfoDatabase_TableList_TableListRow[Connect]:Before`,
2. zeigt einen React-Button im Database-Reiter,
3. prüft macOS, TablePlus und die Socket-Lockdatei einer laufenden Site,
4. ersetzt `/tmp/mysql.sock` durch einen symbolischen Link auf den Site-Socket und
5. öffnet eine `mysql://`-URL über einen zusammengesetzten Shell-Befehl.

Die zentrale Funktion – eine laufende Local-Datenbank mit einem Klick in einem nativen Client zu öffnen – wurde beibehalten. Der Socket-Eingriff und die Shell-Zusammensetzung wurden bewusst nicht übernommen.

## Aktuelle Local-Schnittstelle

Die aktuelle Local-Dokumentation führt den verwendeten Content-Hook weiterhin auf. Das `site`-Objekt stellt unter anderem `site.mysql` sowie `site.ports.MYSQL` bereit. Deshalb kann das Add-on eine eindeutige TCP-Verbindung zu genau der ausgewählten Site herstellen.

Relevante Quellen:

- [Building your Add-on](https://localwp.com/help-docs/building-your-add-on/)
- [Content Hooks](https://localwp.com/help-docs/building-your-add-on/content-hooks/)
- [Common Parameters](https://localwp.com/help-docs/building-your-add-on/common-parameters/)
- [Context API](https://localwp.com/help-docs/building-your-add-on/context-api/)

## Aktuelle TablePro-Schnittstelle

TablePro registriert `mysql://` unter macOS und kann solche URLs als temporäre Verbindungen öffnen. Die Dokumentation empfiehlt bei konkurrierenden URL-Handlern ausdrücklich `open -b com.TablePro`. Der Bundle-Identifier ist auch im Open-Source-Projekt von TablePro hinterlegt.

Relevante Quellen:

- [Connection URL Reference](https://docs.tablepro.app/databases/connection-urls)
- [URL Scheme](https://docs.tablepro.app/external-api/url-scheme)
- [TablePro-Quellprojekt](https://github.com/TableProApp/TablePro)

TablePros `tablepro://import`-Aktion wurde nicht verwendet: Sie speichert eine Verbindung, akzeptiert absichtlich kein Passwort und öffnet einen Editor zur manuellen Nachbearbeitung. Für den gewünschten Ein-Klick-Workflow ist die direkte `mysql://`-Verbindung vorgesehen.

## Übertragene und verbesserte Funktionen

| Bereich | Upstream TablePlus | Local TablePro |
|---|---|---|
| Local-UI | Button im Database-Reiter | gleicher offizieller Content-Hook |
| Site-Status | Socket-Lockdatei | Socket-Lockdatei plus gültiger TCP-Port |
| Verbindung | impliziter Standard-Socket | explizit `127.0.0.1:site.ports.MYSQL` |
| Client-Auswahl | Standard-Handler von `mysql://` | erzwungenes Bundle `com.TablePro` |
| Prozessstart | Shell-String mit `exec` | Argumentliste mit `execFile` |
| Kodierung | teilweise | Benutzer, Passwort, DB und Name vollständig kodiert |
| `/tmp/mysql.sock` | wird gelöscht/neu verlinkt | bleibt unangetastet |
| Lebenszyklus | Intervall ohne Cleanup | Intervall wird beim Unmount beendet |
| Laufzeitabhängigkeiten | gebündelte Komponentenbibliothek | keine; nutzt Locals React-Laufzeit |
| Installation | `.tgz` | `.tgz`, Entwicklungs-Link und manueller Fallback dokumentiert |

## Grenzen

- Nur macOS: TablePro ist laut Hersteller auf macOS stabil; Linux befindet sich in Entwicklung.
- Nur Local-MySQL/MariaDB: Local-WordPress-Sites stellen MySQL-kompatible Datenbanken bereit.
- Der erste externe URL-Aufruf benötigt in TablePro eine Bestätigung.
- Das Add-on erkennt TablePro nur an den drei dokumentierten App-Pfaden. Bei einem abweichenden Installationsort muss die Anwendung verschoben oder `getApplicationPaths()` angepasst werden.
