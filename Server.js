//console clear, damit die Ausgabe sauberer aussieht
console.clear();
//Bei erstmaligem Ausführen -> npm run server in die Konsole, damit nodemon läuft
//Sollte in der package.json-Datei stehen
//Zumindest bei mir am Heimrechner :D

//Benötigte Module
const express = require("express");
const app = express();
app.use(express.urlencoded({extended: true}));


//body-parser
const bodyParser = require("body-parser");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);


//Pop-Ups
const alert = require("alert");

//Verschlüsselung der Passwörter
const bcrypt = require("bcrypt");


//Session-Variablen
const session = require('express-session');
app.use(session({
    secret: 'example',
    saveUninitialized: false,
    resave:false
}));


//Startet Webserver
app.listen(3000, function () {
    console.log("listening on port 3000");
  });


//ejs Initialisierung
app.engine(".ejs", require("ejs").__express);
app.set("view engine", "ejs");

app.use(express.urlencoded({extended:true}));
app.use(express.json());




//Die benötigten Ordner freigeben
app.use(express.static(__dirname + "/images"));
app.use(express.static(__dirname + "/html"));
app.use(express.static(__dirname + "/views"));


//Die benötigten Seiten
app.get("/Start",function(req,res){
    res.sendFile(__dirname + "/views/t1_p1_setTaskAndTimer.html");
});

app.get("/Vorbei",function(req,res){
    res.sendFile(__dirname + "/views/evaluate.html");
});

app.get("/Fehlschlag",function(req,res){
    res.sendFile(__dirname + "/views/t1_p5_taskFailed.html");
});

app.get("/Log-On",function(req,res){
    res.sendFile(__dirname + "/views/logon.html");
});


//Datenbanken & sqlite3
const sqlite3 = require("sqlite3").verbose();

//Datenbank für Trivia
let db_trivia = new sqlite3.Database("trivia.db",(err)=>{
    if(err){
        return console.log(err.message);
    }
    console.log("Connected to trivia database");
});

/*
db_tasks wird hier im Code des Servers bei Sachen wie "db_tasks.run() oder db_tasks.all() verwendet"

In SQL-Aufrufen sind dann user_datenbank oder tasks_datenbank zu verwenden

*/

//Datenbank für Aufgaben
let db_tasks = new sqlite3.Database("tasks.db",(err)=>{
    if(err){
        return console.log(err.message);
    }
    console.log("Connected to tasks database");
});


//Console.log() im Code sind mainly fürs debugging 



//Task and Time in Tier 1 setzten.
app.post("/inputs",function(req,res)  {

    //Übergebene Inputs abspeichern
    let param_name    = req.body.task;
    let param_minutes = req.body.minutes;
    let param_seconds = req.body.seconds;

    console.log(param_minutes);

/*  Wenn Minutenfeld freigelassen wird, wird Minuten auf 0 gesetzt
    if(param_minutes === "") {
        param_minutes = "0";
    }

    if(param_seconds === ""){
        param_seconds = "1";
    }
*/
    //Hier wird der input string für die Zeitangabe in eine Nummer konvertiert
    //Wenn es ein Buchstabe oder leerer string ist, wird es zu NaN
    //Beispiel: "10" -> 10
    //Beispiel: "10.5" -> 10.5
    //Beispiel: "" -> NaN
    let check_Minute = Number(param_minutes);
    let check_Second = Number(param_seconds);
    
    //Debugging
    console.log(check_Minute);
    console.log(check_Second);
    console.log(typeof(check_Minute));
    console.log(typeof(check_Second));

    //Es wird gecheckt, ob die Nummer ein int ist und das result in der Konsole ausgegeben
    console.log(Number.isInteger(check_Minute));
    console.log(Number.isInteger(check_Second));


    //If-Abfrage ist noch etwas clunky
    //Es werden alle Fälle abgefragt, die falschlaufen können. Wenn einer falsch ist, kommt Fehlermeldung
    //Minuten dürfen nicht unter 0 sein, Sekunden dürfen nicht kleiner 1 sein, Minuten und Sekunden dürfen als Typ nicht NaN haben
    //Sekunden dürfen nicht größer als 59 sein, wegen Timer-Funktion; zuletzt dürfen Minuten und Sekunden keine Kommazahlen sein
    if(check_Minute < 0 || check_Second <= 0 || isNaN(check_Minute) || isNaN(check_Second) || check_Second >= 60 || Number.isInteger(check_Minute)!= true || Number.isInteger(check_Second)!=true){
        
        console.log(typeof(param_minutes) + " " + typeof(param_seconds));
        
        //Pop-Up welches den user daran erinnert, was nicht eingegeben werden darf
        alert("Bitte geben Sie eine ganze und positive Zahl für Minuten und Sekunden an." + " Sekunden dürfen nicht 59 nicht überschreiten");
        
        //Eingabeseite wird neu geladen
        res.redirect("/t1_p1_setTaskAndTimer.html");
    }

    //Wenn alles richtig eingegeben wurde
    else{

    //Datenbankeintrag der benötigten Zeit anlegen
    let param_time = "Minuten: " + param_minutes + " ; Sekunden: " + param_seconds;
    
//Wenn fehlende Eingaben vorhanden sind, wird Zeit automatisch eingegeben   

//Eintrag wird in Liste der vorherigen Aufgaben eingetragen
db_tasks.run(
    `INSERT INTO tasks_datenbank(task,time_task,is_done) VALUES('${param_name}','${param_time}','${"nein"}')`,
);

//Array zur Übergabe an das Triviaglücksrad erstellen
let trivList = [];

//Trivia wird abgerufen und an Array gegeben
db_trivia.all(
    `SELECT * FROM trivia_datenbank`, 
    function(err,rows){

        rows.forEach((row)=>{
            trivList.push(row.trivia);
        });
       
        res.render("t1_p2_showCountdown", {minutes : param_minutes, seconds: param_seconds, aufgabe: param_name,trivia_liste:trivList});
    });
    }}
)



//Anmeldung, falls user bereits besteht
app.post("/logon",function(req,res){

    const param_username = req.body.username;
    const param_passwort = req.body.passwort;

    //Datenbank durchgehen, ob Benutzer bereits existiert
    db_tasks.all(

        //Es wird nach Benutzernamen gesucht
        `SELECT * FROM user_datenbank WHERE username_data = '${param_username}'`,
        function(err,row){
            if(err) throw err;

            //Wenn username gefunden wurde
            if(row.length == 1){

                //zu überprüfendes Passwort
                const hash = row[0].passwort_data;

                //Datenbankeintrag und Eingabe werden überprüft
                const isValid = bcrypt.compareSync(param_passwort,hash);
                if(isValid == true){
                    
                    //Sessionvariable wird gesetzt
                    req.session.sessionValue = param_username;
                    console.log(req.session.sessionValue);

                    //User wird auf neuer Seite mitgeteilt, dass er sich erfolgreich angemeldet hat
                    res.render("loginErfolgreich", {});
                }
            }

            //Wenn user nicht in Datenbank vorhanden -> Fehlermeldung
            if(row.length == 0){
                alert("User nicht vorhanden!");
            }
        }
    )


});


//Benutzer abmelden
app.post("/logoff", function (req, res) {
    //Sessionvariable wird gelöscht
    delete req.session.sessionValue;
    console.log(req.session.sessionValue != 1);
    res.redirect("/logon.html");
  });


//User wird registriert
app.post("/sign_up",function(req,res){

    const param_username = req.body.username;
    const param_passwort = req.body.passwort;

    //Prüfen, ob der user bereits registriert ist
    db_tasks.all(
        `SELECT * FROM user_datenbank WHERE username_data = '${param_username}'`,
        function(err,row){
            if(err) throw err;

            //Benutzer bereits vorhanden
            if(row.length != 0){
                alert("Benutzername bereits vergeben");
            }

            //Benutzer wird hinzugefügt
            if(row.length == 0){
                console.log("User noch nicht vorhanden!");
                const hash = bcrypt.hashSync(param_passwort,10);
                let chicken_status = 1;
                
                db_tasks.run(
                    `INSERT INTO user_datenbank(username_data,passwort_data,chicken_status) VALUES('${param_username}','${hash}','${chicken_status}')`,
                    
                    //Seite wird refreshed
                    res.redirect("/logon.html")
                )
            }


        }
    )


});




//Aufgabe wurde geschafft!
app.post("/ergebnis_ja",function(req,res){

    //Temporäre Variablen erstellen
    let temp_chicken_status = 0;
    let temp_username = req.session.sessionValue;
    //Bild des Huhns. Pfad im /images-Ordner
    let chicken_image_path = "";


    //Debugging
    console.log(temp_username);
     
    //Die zuletzt eingetragene Aufgabe wird aufgerufen und abgeändert, wenn sie gemacht wurde
    //Hier das is_done updaten, damit es in task_done angezeigt werden kann
    //Dazu muss der neueste Eintrag abgerufen werden
    db_tasks.run(

        `UPDATE tasks_datenbank SET is_done = "ja" WHERE id = (SELECT MAX(id) FROM tasks_datenbank) `

    );

   


    db_tasks.all(

        `SELECT * FROM user_datenbank WHERE username_data = '${temp_username}'`,
        function(err,row){

            //temporäre Variable nimmt aktuellen Wert in der Datenbank an
            temp_chicken_status = row[0].chicken_status;
            console.log("temporärer chicken_status vor: " + temp_chicken_status);

            //Sofern der counter unter 5 ist, weil 5 das Endstatdium des Huhns ist wird inkrementiert.
            if(row[0].chicken_status <5){

                console.log("Chicken Status vor Inkrement:" + row[0].chicken_status);

                //Chicken_status inkrementieren
                db_tasks.run(
                    
                    `UPDATE user_datenbank SET chicken_status = chicken_status + 1 WHERE username_data = '${temp_username}'`
                    
                )
                
                //Debug; Datenbankeintrag wird nur verzögert inkrementiert, daher funktionierte es vorher nicht
                console.log("Chicken Status nach Inkrement:" + row[0].chicken_status);


                //Stattdessen wird temporärer Wert benutzt
                temp_chicken_status += 1;
                console.log("temporärer chicken_status nach: " + temp_chicken_status);


            }
            
        }
    )

    //Auswahl des benötigten Bilds für Gratulationsseite
    db_tasks.all(
        `SELECT * FROM user_datenbank WHERE username_data = '${temp_username}'`,
        function(err,row){
            
            //Ei wird ausgesucht
            switch(temp_chicken_status){
                case 1:

                chicken_image_path = "Egg_Clear.png";
                break;

                case 2:

                chicken_image_path = "Egg_Cracked.png";
                break;
                
                case 3:

                chicken_image_path = "Chicken_Hatched.png";
                break;

                case 4:
                
                chicken_image_path = "Chicken_Young.png";
                break;

                case 5:

                chicken_image_path = "Chicken_Adult.png";
                break;
            }

            console.log(chicken_image_path);

            res.render("t1_p4_taskDone",{image:chicken_image_path});
        }
    )


//Legacy-Code. Hier wurde früher noch der Name der Aufgabe mitgeschickt, um ihn im Erfolgs-Screen zu zeigen
        //Hier wird der Eintrag abgeschickt, falls er im erfolgreichem screen gezeigt werden soll
    /*
    db_tasks.all(
        `SELECT * FROM tasks_datenbank WHERE id = (SELECT MAX(id) FROM tasks_datenbank) `,
        function(err,row){
            //Die Aufgabe wird abgespeichet und mit res.render an die Seite mit den Glückwünschen geschickt
            const task_success = row[0].task;
            res.render("t1_p4_taskDone",{task_done: task_success});
        }
    );
    
*/
});


//Wenn die Aufgabe nicht geschafft wurde
app.post("/ergebnis_nein",function(req,res){

    //Temporäre Variablen erstellen
    let temp_chicken_status = 0;
    let temp_username = req.session.sessionValue;
    //Name des Bildes im /images-Ordner
    let chicken_image_path = "";

    //Debugging, um korrekten Benutzer zu verifizieren
    console.log("Derzeitiger user: " + temp_username);
    
    //Chicken_status wird um 1 dekrementiert, sofern der counter größer 1 ist
    db_tasks.all(
        `SELECT * FROM user_datenbank WHERE username_data = '${temp_username}'`,
        function(err,row){

            temp_chicken_status = row[0].chicken_status;
            //Debugging
            console.log("temporärer chicken_status vor: " + temp_chicken_status);

            //Falls Status größer als 1 -> Status um 1 dekrementieren
            if(row[0].chicken_status > 1 ){

                console.log("Chicken Status vor Dekrement:" + row[0].chicken_status);

                db_tasks.run(

                    `UPDATE user_datenbank SET chicken_status = chicken_status -1  WHERE username_data = '${temp_username}'`
                    
                )
                    
                
                console.log("Chicken Status nach Dekrement: " + row[0].chicken_status);
                
                //temporäre Variable aktualisieren, damit Auswahl des Bildes passt
                temp_chicken_status -= 1;
                console.log("temporärer chicken_status nach: " + temp_chicken_status);

            }

           
            
        }
    )



    
    //Bild wird anhand des chicken_status ausgewählt
    db_tasks.all(

        `SELECT * FROM user_datenbank WHERE username_data = '${temp_username}'`,
        function(err,row){
           
            switch(temp_chicken_status){
                case 1:

                chicken_image_path = "Egg_Clear.png";
                break;
                
                case 2:

                chicken_image_path = "Egg_Cracked.png";
                break;
                case 3:

                chicken_image_path = "Chicken_Hatched.png";
                break;

                case 4:
                
                chicken_image_path = "Chicken_Young.png";
                break;

                case 5:

                chicken_image_path = "Chicken_Adult.png";
                break;
            }
            

            console.log(chicken_image_path);


            res.render("t1_p5_taskFailed",{image:chicken_image_path});
            
        }
    )

 

});

//Liste der bisherigen Aufgaben wird abgerufen, wenn sie eingesehen werden möchte
app.post("/task_list",function(req,res){
    db_tasks.all(
        `SELECT * FROM tasks_datenbank`,function(err,rows){
            res.render("extras_taskList",{task_liste: rows});
        }
    );
});