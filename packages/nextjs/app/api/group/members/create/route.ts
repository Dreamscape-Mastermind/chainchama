// app/api/group/member/create/route.ts
import { NextResponse } from "next/server";
import prisma from "~~/prisma/db";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, wallet, role, organizationId } = data;

    // Validate that the organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: Number(organizationId) },
    });

    if (!organization) {
      return NextResponse.json({ success: false, error: "Organization not found" }, { status: 404 });
    }

    // Create the new member and link it to the organization
    const member = await prisma.member.create({
      data: {
        name,
        wallet,
        role,
        organization: {
          connect: { id: Number(organizationId) }, // Connect the member to the organization by ID
        },
      },
    });

    return NextResponse.json({ success: true, member });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to create member" }, { status: 500 });
  }
}
