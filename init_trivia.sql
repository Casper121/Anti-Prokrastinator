/*
Initialisiert die Datenbank für die fun facts
laden mit sqlite3: .read init_trivia.sql



//trivia_datenbank enthält die Trivias für das Glücksrad
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
INSERT INTO trivia_datenbank(trivia) VALUES("In der Geschichte von Mexiko gab es einmal drei unterschiedliche Präsidenten an nur einem Tag.");
INSERT INTO trivia_datenbank(trivia) VALUES("In Australien trank ein Schwein 18 Bier auf einem Camping Platz, wurde davon betrunken und versuchte dann, eine Kuh anzugreifen.");
INSERT INTO trivia_datenbank(trivia) VALUES("Zählt man auf Englisch bei Eins beginnend aufwärts, dann ist 1.000 die erste Zahl, in der ein „A“ vorkommt.");
INSERT INTO trivia_datenbank(trivia) VALUES("„Schwuugle“ beschreibt sich selbst als „die schwule Suchmaschine“.");
INSERT INTO trivia_datenbank(trivia) VALUES("Wasser riecht erst dann nach Chlor, wenn jemand ins Becken gepinkelt hat.");
INSERT INTO trivia_datenbank(trivia) VALUES("Ausgewachsene Bären können so schnell laufen wie Pferde.");
INSERT INTO trivia_datenbank(trivia) VALUES("Stephen Hawking hatte die von Ärzten für ihn geschätzte Lebenserwartung um über 50 Jahre übertroffen.");
INSERT INTO trivia_datenbank(trivia) VALUES("Australiens Great Victoria Desert ist größer als das Vereinigte Königreich und Irland zusammen.");
INSERT INTO trivia_datenbank(trivia) VALUES("Das Siegel „Made in Germany“ sollte Engländer ursprünglich vor minderwertiger Ware aus Deutschland warnen.");
INSERT INTO trivia_datenbank(trivia) VALUES("Die Zunge eines Tigers ist so rau, dass das Tier damit sogar Fleisch von einem Knochen lecken kann.");
INSERT INTO trivia_datenbank(trivia) VALUES("Aufgrund plattentektonischer Bewegungen wandert Australien jedes Jahr um etwa sieben Zentimeter Richtung Norden.");
INSERT INTO trivia_datenbank(trivia) VALUES("In Italien vererbte ein Mann seiner Katze sein Vermögen von circa zehn Millionen Euro.");
INSERT INTO trivia_datenbank(trivia) VALUES("Erdbeeren sind gar keine Beeren, sondern werden botanisch den Nüssen zugeordnet.");
INSERT INTO trivia_datenbank(trivia) VALUES("Zu Beginn des 20. Jahrhunderts war Radium ein häufiger Bestandteil von Gesichtscremes");
INSERT INTO trivia_datenbank(trivia) VALUES("Das Croissant ist keine französische Erfindung, sondern kommt aus Österreich.");
INSERT INTO trivia_datenbank(trivia) VALUES("Die größte Katze der Welt besaß eine Länge von 1,23 Metern.");
INSERT INTO trivia_datenbank(trivia) VALUES("In der spanischen Synchronisation von „Terminator 2“ sagt der Terminator nicht „Hasta La vista, Baby“, sondern „Sayonara, Baby“.");
INSERT INTO trivia_datenbank(trivia) VALUES("Die Golden Gate Bridge besteht aus so vielen Drahtseilen, dass sie, würde man sie aneinanderlegen, dreimal die Erde umschließen könnten.");
INSERT INTO trivia_datenbank(trivia) VALUES("In Italien ist es Tradition, an Silvester rote Unterwäsche zu tragen, um im neuen Jahr Glück zu haben.");
INSERT INTO trivia_datenbank(trivia) VALUES("Der Grönlandhai ernährt sich unter anderem auch von Eisbären und Hirschen.");
INSERT INTO trivia_datenbank(trivia) VALUES("Ein positiver Schwangerschaftstest bei Männern kann auf Hodenkrebs hindeuten.");
INSERT INTO trivia_datenbank(trivia) VALUES(" Es dauert 40 Minuten, um ein Straußenei hart zu kochen.");
INSERT INTO trivia_datenbank(trivia) VALUES("Eine reguläre Inspektion inklusive Ölwechsel kostet bei einem Bugatti Veyron 21.000 Dollar.");
INSERT INTO trivia_datenbank(trivia) VALUES("Ein früherer Premierminister von Australien verschwand 1967 spurlos und ist bis heute noch nicht wieder aufgetaucht.");
INSERT INTO trivia_datenbank(trivia) VALUES("Der Weltrekord im „Die meisten Liegestütze an einem Tag“ liegt bei 46.001.");
INSERT INTO trivia_datenbank(trivia) VALUES("Der echte Name des Michelin-Männchens ist „Bibendum“ oder kurz „Bib“.");
INSERT INTO trivia_datenbank(trivia) VALUES("Einhundert Mal lachen verursacht den gleichen Kalorienverbrauch wie ein 15-minütiges Workout auf dem Fahrrad.");
INSERT INTO trivia_datenbank(trivia) VALUES("„Paparazzi“ ist italienisch und heißt so viel wie „nervige Mücken“.");
INSERT INTO trivia_datenbank(trivia) VALUES("Es gibt auch Regenbögen bei Nacht. Man nennt sie „Mondbögen“.");
INSERT INTO trivia_datenbank(trivia) VALUES("Der Name „Microsoft“ ist eine Verbindung aus „Microcomputer“ und „Software“.");


/* Template, damit schnell neue Einträge hinzugefügt werden können
INSERT INTO trivia_datenbank(trivia) VALUES("");
*/