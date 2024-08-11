// app/api/group/create/route.ts
import { NextResponse } from "next/server";
import prisma from "~~/prisma/db";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, description, groupType, role, email } = data;

    // Fetch the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Create the organization with the fetched user ID
    const organization = await prisma.organization.create({
      data: {
        name,
        description,
        groupType,
        role,
        users: {
          connect: { id: user.id }, // Connect the organization to the user(s) by ID
        },
      },
    });

    return NextResponse.json({ success: true, organization });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to create organization" }, { status: 500 });
  }
}
