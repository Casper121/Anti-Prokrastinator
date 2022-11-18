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

//app.get("/Ergebnis")



//Datenbanken & sqlite3
const sqlite3 = require("sqlite3").verbose();

let db_trivia = new sqlite3.Database("triva_datenbank",(err)=>{
    if(err){
        return console.log(err.message);
    }
    console.log("Connected to trivia database");
});

let db_tasks = new sqlite3.Database("tasks_datenbank",(err)=>{
    if(err){
        return console.log(err.message);
    }
    console.log("Connected to tasks database");
});

let db_activities = new sqlite3.Database("activities_datenbank",(err)=>{
    if(err){
        return console.log(err.message);
    }
    console.log("Connected to activity database");
});


app.post("/inputs",function(req,res)  {

    const param_name = req.body.task;
    const param_minutes = req.body.minutes;
    const param_seconds = req.body.seconds;

/*
db_tasks.run(
    `INSERT INTO tasks_datenbank(task,time_task) VALUES('${param_name}','${param_time}')`,
);
*/
res.render("t1_p2_showCountdown",{minutes : param_minutes,seconds:param_seconds,aufgabe:param_name,});
});

app.post("/ergebnis_ja",function(req,res){
    res.redirect("/t1_p4_taskDone.html");
})

app.post("/ergebnis_nein",function(req,res){
    res.redirect("/t1_p5_taskFailed.html");
})