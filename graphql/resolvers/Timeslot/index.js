import Timeslot from "../../../models/Timeslot";

const respond = (resolve, reject) => (err, res) => {
  err ? reject(err) : resolve(res);
};

export default {
  Query: {
    timeslot: (root, args) => {
      return new Promise((resolve, reject) => {
        Timeslot.findOne(args).exec(respond(resolve, reject));
      });
    },
    timeslots: (root, args) => {
      return new Promise((resolve, reject) => {
        Timeslot.find(args).populate().exec(respond(resolve, reject));
      });
    }
  },
  Mutation: {
    addTimeslot: (root, { type, from, to}) => {
      const newTimeslot = new Timeslot({ type, from, to });

      return new Promise((resolve, reject) => {
        newTimeslot.save(respond(resolve, reject));
      });
    },
    editTimeslot: (root, { _id, taken }) => {
      return new Promise((resolve, reject) => {
        Timeslot.findOneAndUpdate({ _id }, { $set: { taken }}).exec(respond(resolve, reject));
      });
    },
    deleteTimeslot: (root, args) => {
      return new Promise((resolve, reject) => {
        Timeslot.findOneAndRemove(args).exec(respond(resolve, reject));
      });
    }
  }
};
