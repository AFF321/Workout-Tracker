const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require('path');
const exphbs = require('express-handlebars');
const PORT = process.env.PORT || 3000;
const mongojs = require("mongojs");
const db = require("./models");

const app = express();

app.use(logger("dev"));

app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true });
var publicPath = path.join(__dirname, 'public');
app.get("/exercise",(req,res)=>{
    res.sendFile(publicPath + '/exercise.html');
})

app.get("/stats",(req,res)=>{
    res.sendFile(publicPath + '/stats.html');
})
app.get("/api/workouts", (req,res)=>{
    db.Workout.find().sort({day:1})
    .then(dbWorkout =>{
        res.json(dbWorkout)
    })
    .catch(err =>{
        res.json(err);
    })
})
app.put("/api/workouts/:id", (req,res)=>{
    if(req.params.id){
db.Workout.update({_id:mongojs.ObjectId(req.params.id)},
    {$set:{type:req.body.title , name:req.body.name, duration:req.body.duration, weight:req.body.duration,reps:req.body.reps,sets:req.body.sets}},
    (err,data) =>{
        if(err){
            console.log(err);
        }else{
            res.json(data)
        }
    }
)}
else{

}

})
app.post("/api/workouts", (req, res) =>{
    console.log(req)
    db.Workout.create({
        day:new Date(new Date().getDate()),
        exercices:[{
         type:req.body.type,
         name: req.body.name,
         duration: req.body.duration,
         weight: req.body.weight,
         reps: req.body.reps,
         sets: req.body.sets
        }]
        }, 
         (err,data) =>{
        if(err){
          console.log(err)
        } else{
          res.json(data)
        }
      })
})
app.get("/api/workouts/range", (req,res)=>{
    db.Workout.find().limit(7).sort({$natural:-1})
    .then(dbWorkout =>{
        res.json(dbWorkout)
    })
    .catch(err =>{
        res.json(err);
    })
})

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});