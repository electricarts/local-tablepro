# Changelog

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
