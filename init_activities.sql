/*
Initialisiert die Datenbank für die activies
laden mit sqlite3: .read init_activities.sql

*/

/*
Für neue activity jeweils die höchte ID benutzen
*/


CREATE TABLE activies_datenbank(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    activity TEXT NOT NULL,
);

