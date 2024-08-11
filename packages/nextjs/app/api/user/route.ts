import { NextResponse } from "next/server";
import prisma from "~~/prisma/db";

// GET /api/users - Fetch all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: { accounts: true, sessions: true },
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching users" }, { status: 500 });
  }
}

// POST /api/users - Create a new user
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newUser = await prisma.user.create({
      data,
    });
    return NextResponse.json(newUser);
  } catch (error) {
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
