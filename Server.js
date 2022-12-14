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

const alert = require("alert");

const bcrypt = require("bcrypt");

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

app.get("/Log-On",function(req,res){
    res.sendFile(__dirname + "/views/logon.html");
});

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


//Datenbanken mit sqlite3 noch serstellen, sonst funktionieren sie nicht!

//Datenbanken & sqlite3
const sqlite3 = require("sqlite3").verbose();

let db_trivia = new sqlite3.Database("trivia.db",(err)=>{
    if(err){
        return console.log(err.message);
    }
    console.log("Connected to trivia database");
});

/*
db_tasks wird hier im Code des Servers bei Sachen wie "db_tasks.run() oder db_tasks.all() verwendet"
In den sql-Aufrufen wird dann aber die tasks_datenbank angesprochen, die in der sql-Datei erstellt wurde

*/
let db_tasks = new sqlite3.Database("tasks.db",(err)=>{
    if(err){
        return console.log(err.message);
    }
    console.log("Connected to tasks database");
});


//Task and Time in Tier 1 setzten.
app.post("/inputs",function(req,res)  {

    //Übergebene Inputs abspeichern
    var param_name    = req.body.task;
    var param_minutes = req.body.minutes;
    var param_seconds = req.body.seconds;
    //Datenbankeintrag
    var param_time = "Minuten: " + param_minutes + " ; Sekunden: " + param_seconds;
    
    //Wenn fehlende Eingaben vorhanden sind, wird Zeit ersetzt
    if(param_minutes ==  "") {
        param_minutes = "0";
    }
    if(param_seconds ==  "") {
        param_seconds = "1";
    }

//Eintrag wird in Liste der vorherigen Aufgaben eingetragen
db_tasks.run(
    `INSERT INTO tasks_datenbank(task,time_task,is_done) VALUES('${param_name}','${param_time}','${"nein"}')`,
);

//Array zur Übergabe an das Triviaglücksrad erstellen
var trivList = [];

//Trivia wird abgerufen und an Array gegeben
db_trivia.all(
    `SELECT * FROM trivia_datenbank`, 
    function(err,rows){

        rows.forEach((row)=>{
            trivList.push(row.trivia);
        });
       
        res.render("t1_p2_showCountdown", {minutes : param_minutes, seconds: param_seconds, aufgabe: param_name,trivia_liste:trivList});
    });
    }
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

    //Die zuletzt eingetragene Aufgabe wird aufgerufen und abgeändert, wenn sie gemacht wurde

    //Hier das is_done updaten, damit es in task_done angezeigt werden kann
    //Dazu muss der neueste Eintrag abgerufen werden
    var temp_chicken_status = 0;
    var temp_username = req.session.sessionValue;
    var chicken_image_path = "";

    console.log(temp_username);
     
    db_tasks.run(

        `UPDATE tasks_datenbank SET is_done = "ja" WHERE id = (SELECT MAX(id) FROM tasks_datenbank) `

        );

   


    db_tasks.all(
        `SELECT * FROM user_datenbank WHERE username_data = '${temp_username}'`,
        function(err,row){
            if(row[0].chicken_status <5){

                console.log("Chicken Status vor Inkrement:" + row[0].chicken_status);

                db_tasks.run(
                    `UPDATE user_datenbank SET chicken_status = chicken_status + 1 WHERE username_data = '${temp_username}'`
                    
                )
            }

            temp_chicken_status=row[0].chicken_status;
            

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

            console.log("Chicken Status nach Inkrement:" + row[0].chicken_status);

            console.log(temp_chicken_status);
            console.log(chicken_image_path);

            res.render("t1_p4_taskDone",{image:chicken_image_path});
            
        }
    )

        //Hier wird der Eintrag abgeschickt
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

app.post("/ergebnis_nein",function(req,res){

    //Die zuletzt eingetragene Aufgabe wird aufgerufen und abgeändert, wenn sie gemacht wurde

    //Hier das is_done updaten, damit es in task_done angezeigt werden kann
    //Dazu muss der neueste Eintrag abgerufen werden
    var temp_chicken_status = 0;
    var temp_username = req.session.sessionValue;
    var chicken_image_path = "";

    console.log("Derzeitiger user: " + temp_username);
    

    db_tasks.run(
        `UPDATE user_datenbank SET chicken_status = chicken_status -1  WHERE username_data = '${temp_username}'`
        
    )


    db_tasks.all(

        `SELECT * FROM user_datenbank WHERE username_data = '${temp_username}'`,
        function(err,row){
           
            temp_chicken_status=row[0].chicken_status;
            

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
            console.log(temp_chicken_status);
            console.log(chicken_image_path);


            console.log("Chicken Status nach Dekrement: " + row[0].chicken_status);
            res.render("t1_p5_taskFailed",{image:chicken_image_path});
            
        }
    )

 

});


app.post("/task_list",function(req,res){
    db_tasks.all(
        `SELECT * FROM tasks_datenbank`,function(err,rows){
            res.render("extras_taskList",{task_liste: rows});
        }
    );
});