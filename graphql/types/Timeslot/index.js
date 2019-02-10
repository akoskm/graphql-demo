export default `
  type Timeslot {
    _id: String!
    type: String!
    from: String!
    to: String!
    taken: Boolean!
  }

  type Query {
    timeslot(_id: String!): Timeslot
    timeslots(type: String): [Timeslot]!
  }

  type Mutation {
    addTimeslot(type: String!, from: String!, to: String!): Timeslot
    deleteTimeslot(_id: String!): Timeslot
    editTimeslot(_id: String!, taken: Boolean!): Timeslot
  }
`;
