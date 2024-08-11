// app/api/group/create/route.ts
import { NextResponse } from "next/server";
import prisma from "~~/prisma/db";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, description, groupType, role, userId } = data;

    // Add the smartcontract and push the code.

    const organization = await prisma.organization.create({
      data: {
        name,
        description,
        groupType,
        role,
        users: {
          connect: { id: userId }, // Connect the organization to the user by userId
        },
      },
    });

    return NextResponse.json({ success: true, organization });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to create organization" }, { status: 500 });
  }
}
