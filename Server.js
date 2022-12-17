//console clear, damit die Ausgabe sauberer aussieht
console.clear();
//Bei erstmaligem Ausführen -> npm run server in die Konsole, damit nodemon läuft
//Sollte in der package.json-Datei stehen
//Zumindest bei mir am Heimrechner :D

//Benötigte Module
const express = require("express");
const app = express();
app.use(express.urlencoded({extended: true}));

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



//Datenbanken mit sqlite3 noch serstellen, sonst funktionieren sie nicht!

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



//Task and Time in Tier 1 setzten.
app.post("/inputs",function(req,res)  {

    var param_name    = req.body.task;
    var param_minutes = req.body.minutes;
    var param_seconds = req.body.seconds;

    console.log(param_minutes);

    if(param_minutes ==  "") {
        param_minutes = "0";
    }

    var check_Minute = Number(param_minutes);
    var check_Second = Number(param_seconds);
    
    console.log(check_Minute);
    console.log(check_Second);
    console.log(typeof(check_Minute));
    console.log(typeof(check_Second));
    console.log(Number.isInteger(check_Minute));
    console.log(Number.isInteger(check_Second));

    if(check_Minute < 0 || check_Second <= 0 || isNaN(check_Minute) || isNaN(check_Second) || check_Second >= 60 || Number.isInteger(check_Minute)!= true || Number.isInteger(check_Second)!=true){
        console.log(typeof(param_minutes) + " " + typeof(param_seconds));
        alert("Bitte geben Sie eine ganze und positive Zahl für Minuten und Sekunden an." + " Sekunden dürfen nicht über 59 sein");
        res.redirect("/t1_p1_setTaskAndTimer.html");
    }
    else{

    //Datenbankeintrag
    var param_time = "Minuten: " + param_minutes + " ; Sekunden: " + param_seconds;
    
    /*
    if(param_minutes ==  "") {
        param_minutes = "0";
    }
    */

    if(param_seconds ==  "") {
        param_seconds = "1";
    }

db_tasks.run(
    `INSERT INTO tasks_datenbank(task,time_task,is_done) VALUES('${param_name}','${param_time}','${"nein"}')`,
);

var trivList = [];

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

    db_tasks.all(
        `SELECT * FROM user_datenbank WHERE username_data = '${param_username}'`,
        function(err,row){
            if(err) throw err;
            if(row.length == 1){
                const hash = row[0].passwort_data;
                const isValid = bcrypt.compareSync(param_passwort,hash);
                if(isValid == true){
                    req.session.sessionValue = param_username;
                    console.log(req.session.sessionValue);

                    res.render("loginErfolgreich", {});
                }
            }
            if(row.length == 0){
                alert("User nicht vorhanden!");
            }
        }
    )


});


//Benutzer abmelden
app.post("/logoff", function (req, res) {
    delete req.session.sessionValue;
    console.log(req.session.sessionValue != 1);
    res.redirect("/logon.html");
  });


//User wird registriert
app.post("/sign_up",function(req,res){

    const param_username = req.body.username;
    const param_passwort = req.body.passwort;

    //Prüfen, ob der user bereits angemeldet ist
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
                var chicken_status = 1;
                
                db_tasks.run(
                    `INSERT INTO user_datenbank(username_data,passwort_data,chicken_status) VALUES('${param_username}','${hash}','${chicken_status}')`,
                    
                    res.redirect("/logon.html")
                )
            }


        }
    )


});




//Aufgabe wurde geschafft!
app.post("/ergebnis_ja",function(req,res){

    //Temporäre Variablen erstellen
    var temp_chicken_status;
    var temp_username = req.session.sessionValue;
    var chicken_image_path = "";

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

            //Sofern der counter unter 5 ist, wird inkrementiert
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
    var temp_chicken_status;
    var temp_username = req.session.sessionValue;
    var chicken_image_path = "";

    //Debugging, um korrekten Benutzer zu verifizieren
    console.log("Derzeitiger user: " + temp_username);
    
    //Chicken_status wird um 1 dekrementiert, sofern der counter größer 1 ist
    db_tasks.all(
        `SELECT * FROM user_datenbank WHERE username_data = '${temp_username}'`,
        function(err,row){

            temp_chicken_status = row[0].chicken_status;
            //Debugging
            console.log("temporärer chicken_status vor: " + temp_chicken_status);


            if(row[0].chicken_status > 1 ){

                console.log("Chicken Status vor Dekrement:" + row[0].chicken_status);

                db_tasks.run(
                    `UPDATE user_datenbank SET chicken_status = chicken_status -1  WHERE username_data = '${temp_username}'`
                    
                )
                    
                
                console.log("Chicken Status nach Dekrement: " + row[0].chicken_status);
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

//Liste der bisherigen Aufgaben wird abgerufen
app.post("/task_list",function(req,res){
    db_tasks.all(
        `SELECT * FROM tasks_datenbank`,function(err,rows){
            res.render("extras_taskList",{task_liste: rows});
        }
    );
});