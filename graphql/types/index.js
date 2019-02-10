import { mergeTypes } from "merge-graphql-schemas";

import Timeslot from "./Timeslot/";

const typeDefs = [Timeslot];

export default mergeTypes(typeDefs, { all: true });