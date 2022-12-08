/*
Initialisiert die Datenbank für die (eigentlichen) Aufgaben
laden mit sqlite3: .read init_tasks.sql

*/



CREATE TABLE tasks_datenbank(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task TEXT NOT NULL,
    time_task TEXT NOT NULL,
    is_done TEXT NOT NULL
);

CREATE TABLE user_datenbank(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username_data TEXT NOT NULL,
    passwort_data TEXT NOT NULL,
    chicken_status INTEGER NOT NULL

);