/*
Initialisiert die Datenbank für die (eigentlichen) Aufgaben
laden mit sqlite3: .read init_tasks.sql



//tasks_datenbank speichert den Namen der Aufgabe, die gegebene Zeit und den Status des Erfolgs ab 
//is_done wird am Anfang auf nein gesetzt und beim Erfolg geändert


*/
CREATE TABLE tasks_datenbank(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task TEXT NOT NULL,
    time_task TEXT NOT NULL,
    is_done TEXT NOT NULL
);

//user_datenbank speichert die Benutzernamen, das Passwort(gehashed) und den Status des Huhns ab
//Der chicken_status wird am Anfang auf 1 gesetzt, damit user beim Ei anfängt

CREATE TABLE user_datenbank(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username_data TEXT NOT NULL,
    passwort_data TEXT NOT NULL,
    chicken_status INTEGER NOT NULL

);