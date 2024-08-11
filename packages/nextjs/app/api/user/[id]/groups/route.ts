// app/api/user/[userId]/groups/route.ts
import { NextResponse } from "next/server";
import prisma from "~~/prisma/db";

// GET request to /api/user/[userId]/groups
export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params;

    // Fetch all organizations linked to the user
    const organizations = await prisma.organization.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
    });

    if (organizations.length === 0) {
      return NextResponse.json({ success: false, error: "No organizations found for this user" }, { status: 404 });
    }

    return NextResponse.json({ success: true, organizations });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to fetch organizations" }, { status: 500 });
  }
}
