import { convexAuth } from "@convex-dev/auth/server";

import type { NextRequest } from "next/server";

const { GET: convexGET, POST: convexPOST } = convexAuth();

export async function GET(request: NextRequest) {
    return await convexGET(request);
}

export async function POST(request: NextRequest) {
    return await convexPOST(request);
}
