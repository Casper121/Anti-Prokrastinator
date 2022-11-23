/*
Initialisiert die Datenbank für die activies
laden mit sqlite3: .read init_activities.sql

*/

/*
Für neue activity jeweils die höchte ID benutzen
*/


CREATE TABLE datenPuns(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pun TEXT NOT NULL,
);

