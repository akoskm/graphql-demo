import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Create the Timeslot Schema.
const TimeslotSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  from: {
    type: Date,
    required: true
  },
  to: {
    type: Date,
    required: true
  },
  taken: {
    type: Boolean,
    required: true,
    default: false
  }
});

const Timeslot = mongoose.model("Timeslot", TimeslotSchema);

export default Timeslot;
