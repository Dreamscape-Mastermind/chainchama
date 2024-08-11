import Image from "next/image";
import type { NextPage } from "next";
import CreateForm from "~~/components/group/CreateForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "new Group",
  description: "Create a new group",
});

const CreatePage: NextPage = () => {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Group</CardTitle>
          <CardDescription>Fill out the form to create a new group for your organization.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateForm />
        </CardContent>
      </Card>
      <div className="bg-muted rounded-lg overflow-hidden">
        <Image
          src="/placeholder.svg"
          width={800}
          height={600}
          alt="Group Image"
          className="w-full h-full object-cover"
          style={{ aspectRatio: "800/600", objectFit: "cover" }}
        />
      </div>
    </div>
  );
};

export default CreatePage;
