import { api } from "../../../../convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId } = body;

        if (!userId) {
            return new Response(JSON.stringify({ error: "Missing userId" }), { status: 400 });
        }

        const user = await convex.query(api.users.getUserByUserId, { userId });

        if (user) {
            return new Response(JSON.stringify({ exists: true }), { status: 200 });
        } else {
            return new Response(JSON.stringify({ exists: false }), { status: 404 });
        }
    } catch (error) {
        console.error("Error checking user:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
