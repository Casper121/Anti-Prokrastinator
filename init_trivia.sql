/*
Initialisiert die Datenbank für die fun facts
laden mit sqlite3: .read init_trivia.sql

*/



CREATE TABLE trivia_datenbank(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trivia TEXT NOT NULL
);

INSERT INTO trivia_datenbank(trivia) VALUES("Kraken haben neun Gehirne und drei Herzen");
INSERT INTO trivia_datenbank(trivia) VALUES("Napoleon Bonaparte hat in 81 Schlachten nur 11 verloren");