// app/api/group/members/[organizationId]/route.ts
import { NextResponse } from "next/server";
import prisma from "~~/prisma/db";

export async function GET(request: Request, { params }: { params: { organizationId: string } }) {
  try {
    const { organizationId } = params;

    console.log(organizationId);

    // Fetch all members associated with the organization
    const members = await prisma.member.findMany({
      where: {
        organizationId: Number(organizationId),
      },
    });

    if (members.length === 0) {
      return NextResponse.json({ success: false, error: "No members found for this organization" }, { status: 404 });
    }

    return NextResponse.json({ success: true, members });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to fetch members" }, { status: 500 });
  }
}
