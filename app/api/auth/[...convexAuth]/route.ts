import { convexAuth } from "@convex-dev/auth/server";
import type { DataModel } from "../../convex/_generated/dataModel";

const { GET, POST } = convexAuth<DataModel>();

export { GET, POST };
