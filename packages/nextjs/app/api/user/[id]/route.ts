import { NextResponse } from "next/server";
import prisma from "~~/prisma/db";

// GET /api/users/[id] - Fetch a single user by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: { accounts: true, sessions: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching user" }, { status: 500 });
  }
}

// PUT /api/users/[id] - Update a user by ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: "Error updating user" }, { status: 500 });
  }
}

// DELETE /api/users/[id] - Delete a user by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.user.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting user" }, { status: 500 });
  }
}


// fetch all groups (organizations) linked to a specific user by their userId
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
