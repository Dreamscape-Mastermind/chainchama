"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { getSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { Button } from "~~/components/ui/button";
import { Input } from "~~/components/ui/input";
import { Label } from "~~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~~/components/ui/select";
import { Textarea } from "~~/components/ui/textarea";

// Yup schema for form validation
const formSchema = Yup.object().shape({
  id: Yup.string(),
  name: Yup.string().required("Organization name is required"),
  description: Yup.string().required("Description is required"),
  groupType: Yup.string()
    .oneOf(["MERRY_GO_ROUND", "SACCO", "OTHER"], "Invalid group type")
    .required("Group Type is required"),
  role: Yup.string().oneOf(["CHAIRPERSON", "MEMBER"], "Invalid role").required("Role is required"),
});

type FormData = Yup.InferType<typeof formSchema>;

const CreateForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const session = await getSession();

      if (session) {
        const response = await fetch("/api/group/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            email: session?.user?.email, // Attach the logged-in user's ID to the request
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create organization");
        }

        const result = await response.json();
        console.log("Organization created:", result);
        // Redirect to /group/member/create on success
        router.push("/group/member/create");
      } else {
        console.error("You must be logged in to create an organization");
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error (e.g., display an error message)
    }
  };

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-2">
        <Label htmlFor="name">Organization Name</Label>
        <Input id="name" placeholder="Enter organization name" {...register("name")} />
        {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="Enter a description" {...register("description")} />
        {errors.description && <p className="text-destructive text-xs">{errors.description.message}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="groupType">Group Type</Label>
        <Select onValueChange={value => setValue("groupType", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select group type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MERRY_GO_ROUND">Merry-Go-Round</SelectItem>
            <SelectItem value="SACCO">Sacco</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>
        {errors.groupType && <p className="text-destructive text-xs">{errors.groupType.message}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="role">Organization Role</Label>
        <Select onValueChange={value => setValue("role", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select organization role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CHAIRPERSON">Chairperson</SelectItem>
            <SelectItem value="MEMBER">Member</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && <p className="text-destructive text-xs">{errors.role.message}</p>}
      </div>

      <Button size="lg" type="submit">
        Proceed to Add Member
      </Button>
    </form>
  );
};

export default CreateForm;
