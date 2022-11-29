//console clear, damit die Ausgabe sauberer aussieht
console.clear();
//Bei erstmaligem Ausführen -> npm run server in die Konsole, damit nodemon läuft
//Sollte in der package.json-Datei stehen
//Zumindest bei mir am Heimrechner :D

//Benötigte Module
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//test

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
})

app.get("/Fehlschlag",function(req,res){
    res.sendFile(__dirname + "/views/t1_p5_taskFailed.html");
})


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


/* Archiviert für später
let db_puns = new sqlite3.Database("activities_datenbank",(err)=>{
    if(err){
        return console.log(err.message);
    }
    console.log("Connected to activity database");
});
*/


app.post("/inputs",function(req,res)  {

    var param_name    = req.body.task;
    var param_minutes = req.body.minutes;
    var param_seconds = req.body.seconds;
    //Datenbankeintrag
    var param_time = "Minuten: " + param_minutes + " ; Sekunden: " + param_seconds;
    

    if(param_minutes ==  "") {
        param_minutes = "0";
    }
    if(param_seconds ==  "") {
        param_seconds = "1";
    }
   


db_tasks.run(
    `INSERT INTO tasks_datenbank(task,time_task,is_done) VALUES('${param_name}','${param_time}','${"nein"}')`,
);


res.render("t1_p2_showCountdown", {minutes : param_minutes, seconds: param_seconds, aufgabe: param_name});
});

//Aufgabe wurde geschafft!
app.post("/ergebnis_ja",function(req,res){

    //Die zuletzt eingetragene Aufgabe wird aufgerufen und abgeändert, wenn sie gemacht wurde

    //Hier das is_done updaten, damit es in task_done angezeigt werden kann
    //Dazu muss der neueste Eintrag abgerufen werden
    db_tasks.run(
        
        `UPDATE tasks_datenbank SET is_done = "ja" WHERE id = (SELECT MAX(id) FROM tasks_datenbank) `
   
        )
        //Hier wird der Eintrag abgeschickt
    db_tasks.all(
        `SELECT * FROM tasks_datenbank WHERE id = (SELECT MAX(id) FROM tasks_datenbank) `,
        function(err,row){
            //Die Aufgabe wird abgespeichet und mit res.render an die Seite mit den Glückwünschen geschickt
            const task_success = row[0].task;
            res.render("t1_p4_taskDone",{task_done: task_success});
        }
    );

});

app.post("/ergebnis_nein",function(req,res){
    res.redirect("/t1_p5_taskFailed.html");
})


app.post("/task_list",function(req,res){
    db_tasks.all(
        `SELECT * FROM tasks_datenbank`,function(err,rows){
            res.render("extras_taskList",{trivia_liste: rows});
        }
    );
});