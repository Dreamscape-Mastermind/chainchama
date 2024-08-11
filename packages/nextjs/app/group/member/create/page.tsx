"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import type { NextPage } from "next";
import MemberForm from "~~/components/group/member/MemberForm";
import MemberList from "~~/components/group/member/MemberList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card";

// import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

// export const metadata = getMetadata({
//   title: "new Member",
//   description: "Create a new Member",
// });

const CreateMemberPage: NextPage = () => {
  const searchParams = useSearchParams();
  const organizationId = searchParams.get("id") || "";

  return (
    <div className="flex gap-6 w-full max-w-4xl mx-auto">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>List of members to be added</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <MemberList organizationId={organizationId} />
        </CardContent>
      </Card>
      <div className="flex-1">
        <Card>
          <CardHeader>
            <CardTitle>Add Member</CardTitle>
            <CardDescription>Add a new member to your project</CardDescription>
          </CardHeader>
          <MemberForm organizationId={organizationId} />
        </Card>
      </div>
    </div>
  );
};

export default CreateMemberPage;
