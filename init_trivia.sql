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
INSERT INTO trivia_datenbank(trivia) VALUES("Bevor Nintendo sich zu Videospielen begeben hat, haben Sie Spielkarten verkauft");
INSERT INTO trivia_datenbank(trivia) VALUES("Der Urkontinent der Erde heißt Pangäa");
INSERT INTO trivia_datenbank(trivia) VALUES("In Microsoft Windows kannst du keinem Ordner den Namen con geben");
INSERT INTO trivia_datenbank(trivia) VALUES("Es ist für die meisten Menschen unmöglich, ihren eigenen Ellbogen zu lecken. (Versuch es!)");
INSERT INTO trivia_datenbank(trivia) VALUES("Die meisten Menschen schlafen in sieben Minuten ein.");
INSERT INTO trivia_datenbank(trivia) VALUES("Die englischen Synchronsprecher, die Micky und Minnie Maus gesprochen haben, haben im wirklichen Leben geheiratet.");
INSERT INTO trivia_datenbank(trivia) VALUES("Der vollständige Name der Barbie-Puppe lautet Barbara Millicent Roberts aus Willows");
INSERT INTO trivia_datenbank(trivia) VALUES("Die originale Barbie-Puppe hat am 9. März 1959 Geburtstag. An diesem Tag wurde sie zum ersten Mal in der New York Toy Fair ausgestellt.");
