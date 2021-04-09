const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const WorkoutsSchema = new Schema({
day:{type:Date}
,

  exercises:[{
  type:String,
  name:String,
  duration:Number,
  weight:Number,
  reps:Number,
  sets:Number
}]
});

const Workout = mongoose.model("Workout", WorkoutsSchema);

module.exports = Workout;
