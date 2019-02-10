import { mergeResolvers } from "merge-graphql-schemas";

import Timeslot from "./Timeslot/";

const resolvers = [Timeslot];

export default mergeResolvers(resolvers);
