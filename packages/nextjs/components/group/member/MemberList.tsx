"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~~/components/ui/avatar";
import { Button } from "~~/components/ui/button";
import { Popover, PopoverTrigger } from "~~/components/ui/popover";

type Member = {
  id: string;
  name: string;
  wallet: string;
  role: "CHAIRPERSON" | "MEMBER";
};

const MemberList = ({ organizationId }: { organizationId: string }) => {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!organizationId) {
        console.error("Organization ID is missing");
        return;
      }

      const response = await fetch(`/api/group/members/${organizationId}`);
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      } else {
        console.error("Failed to fetch members");
      }
    };

    fetchMembers();
  }, [organizationId]);

  return members.map(member => (
    <div key={member.id} className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src="/placeholder-user.jpg" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium leading-none">{member.name}</p>
          <p className="text-sm text-muted-foreground">({member.wallet})</p>
          <p className="text-xs text-muted-foreground">{member.id}</p>
        </div>
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="ml-auto" disabled>
            {member.role} <ChevronDownIcon className="w-4 h-4 ml-2 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
      </Popover>
    </div>
  ));
};

export default MemberList;

function ChevronDownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
