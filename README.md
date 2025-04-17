# AngularProductTest

# `/main`

Eine Cash-Stuffing Applikation (Test DEMO) zur Verwaltung von Kategorien, Budgets, Transaktionen und Saving Goals.

## Funktionalitäten

### Categories & Budgets (Kategorie- & Budgetverwaltung)
- Kategorien anlegen/löschen (z.B. „Lebensmittel“, „Haushalt“)
- Monatliches Budget je Kategorie definieren und Zusammenfassung

### Transactions (Transaktionsverwaltung)
- Einnahmen oder Ausgaben als Transaktionen erfassen
- Transaktionen mit Kategorien und Datum verknüpfen
- Darstellung in Listen und Diagrammen
- Automatische Berechnung des verbleibenden Budgets

### Saving Goals (Sparzielverwaltung)
- Sparziele mit Zielbetrag und optionalem Datum anlegen
- Jeder Sparziel erhält eine eindeutige ID und dynamischen Index
- Überweisungen aus Kategorien in Ziele möglich (TODO)
- Fortschrittsanzeige (mit Prozent und Fortschrittsbalken)
- Dynamische Erkennung und Verknüpfung mit Kategorieauswahl

### Categories Dropdowns (Kategorieauswahl)
- Enthält Basis-Kategorien (z.B. „Freizeit“) + dynamisch generierte Sparziele
- Sparzielkategorien folgen dem Schema: `Goal-<Index>-<Titel>` (z.B. `Goal-2-Urlaub`)
- Kategorie-Dropdowns werden bei jeder Änderung neu generiert
- Eine Sparzielkategorie kann im Bereich "Kategorieverwaltung" weder hinzugefügt noch gelöscht werden, und es kann kein Budget dafür definiert werden.
- Die Verwaltung eines Saving Goals kann ausschließlich im Bereich „Saving Goal Management“ erfolgen.

## Datenmodell
```ts
interface Budget {
  name: string,
  presetBudget: number,
  remainBudget: number,
  allowExtra: boolean,
  extraAllowed: number
}

interface Transaction {
  id: string,
  category: string,     // kann auch ein Sparziel sein
  amount: number,
  date: string,
  type: string,         // 'input' oder 'output'
  description?: string
}

interface SavingGoal {
  id: string;       //via uuidv4(), eindeutig
  title: string;
  targetAmount: number;
  currentAmount: number;
  created: Date,
  deadline?: Date;
  category?: string;
  notes?: string;
  index: number;    // dynamisch berechnet, ab 0
}
```

# `/login`

Eine einfache Loginseite.

# `/material`

Eine Testseite für Angular Material.

# `/openai`

Eine Demoseite für ein AI Chatbox.

# `/logging`

Eine Testseite für Lumberjack Logging Tool.

# `/neobank`

Eine Neobank Dashboard Testseite.

# Code 

## Technologien

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version `19.0.6`.

## Development

* Führe ng serve aus, um den Entwicklungsserver zu starten.
* Navigiere zu http://localhost:4200/.
* Die Anwendung wird automatisch neu geladen, wenn eine der Quelldateien geändert wird.

