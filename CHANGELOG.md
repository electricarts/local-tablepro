# Changelog

## 1.0.4 – 2026-07-22

- Erzwingt TLS für TablePros Verbindung durch die lokale Socket-Brücke.
- Behebt MySQL-8-Fehler 2061 bei `caching_sha2_password`, ohne RSA-Schlüsselabruf oder Änderung des Root-Benutzers.
- Live gegen eine laufende Local-10.1.1-/MySQL-8.0.35-Site mit `root@localhost` validiert.

## 1.0.3 – 2026-07-22

- Überbrückt TablePros fehlende direkte Local-Socket-Unterstützung mit einem lokalen TCP-zu-Unix-Socket-Proxy.
- Bindet die Brücke ausschließlich an `127.0.0.1` und verwendet einen automatisch vergebenen Port.
- Ändert keine MySQL-Benutzer oder Grants und benötigt keinen globalen `/tmp/mysql.sock`-Link.
- Schließt die Site-Brücke, wenn Local die Site stoppt.
- Ergänzt einen Ende-zu-Ende-Test der lokalen Socket-Brücke.

## 1.0.2 – 2026-07-22

- Verbindet über Locals Unix-Socket, damit Local-MySQLs `root@localhost`-Berechtigung greift.
- Verwendet `localhost` ohne TCP-Port in der TablePro-Verbindungs-URL.
- Verwaltet `/tmp/mysql.sock` defensiv: Nur symbolische Links werden aktualisiert; echte Dateien oder Sockets bleiben unangetastet.
- Ergänzt Tests für Erstellen, Wiederverwenden, Umschalten und sichere Ablehnung des Socket-Links.

## 1.0.1 – 2026-07-22

- Liest den MySQL-Port aus der aktuellen Local-10-Struktur `site.services.mysql.ports.MYSQL`.
- Behält die ältere Struktur `site.ports.MYSQL` als Rückwärtskompatibilitäts-Fallback bei.
- Verbessert Kontrast, Farbe und Schriftstärke des Links im dunklen Local-Theme.

## 1.0.0 – 2026-07-22

- Erste TablePro-Variante auf Basis des Funktionsumfangs von `aubreypwd/local-tableplus`.
- Verbindung über den eindeutigen MySQL-TCP-Port der ausgewählten Local-Site.
- Gezielter Start von TablePro über `com.TablePro`.
- Vollständige URL-Kodierung und shell-freier Prozessstart.
- Kein Eingriff in `/tmp/mysql.sock`.
- Tests, Paketierung sowie deutsche Installations- und Nutzungsdokumentation.
