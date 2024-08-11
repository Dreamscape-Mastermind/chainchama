import React from "react";
import type { NextPage } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "~~/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "~~/components/ui/avatar"
import { Popover, PopoverTrigger, PopoverContent } from "~~/components/ui/popover"
import { Button } from "~~/components/ui/button"
import { Label } from "~~/components/ui/label"
import { Input } from "~~/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "~~/components/ui/select"




export const metadata = getMetadata({
  title: "new Member",
  description: "Create a new Member",
});

const CreateMemberPage: NextPage = () => {
  return (
    <div className="flex gap-6 w-full max-w-4xl mx-auto">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>List of members to be added</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">John Doe</p>
                <p className="text-sm text-muted-foreground">0x123456789abcdef</p>
              </div>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="ml-auto" disabled>
                  Admin <ChevronDownIcon className="w-4 h-4 ml-2 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
            </Popover>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback>JL</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">Jane Lim</p>
                <p className="text-sm text-muted-foreground">0x987654321fedcba</p>
              </div>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="ml-auto" disabled>
                  Editor <ChevronDownIcon className="w-4 h-4 ml-2 text-muted-foreground" />
                </Button>
              </PopoverTrigger>
            </Popover>
          </div>
        </CardContent>
      </Card>
      <div className="flex-1">
        <Card>
          <CardHeader>
            <CardTitle>Add Member</CardTitle>
            <CardDescription>Add a new member to your project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="wallet">Wallet Address</Label>
              <Input id="wallet" placeholder="0x123456789abcdef" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select id="role" defaultValue="viewer">
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="John Doe" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button>Add Member</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CreateMemberPage;

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
