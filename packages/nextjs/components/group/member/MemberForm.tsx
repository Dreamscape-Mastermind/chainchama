"use client";

import React, { useState } from "react";
import router from "next/dist/shared/lib/router/router";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Button } from "~~/components/ui/button";
import { CardContent, CardFooter } from "~~/components/ui/card";
import { Input } from "~~/components/ui/input";
import { Label } from "~~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~~/components/ui/select";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  wallet: yup.string().required("Wallet address is required"),
  role: yup.mixed<"CHAIRPERSON" | "MEMBER">().oneOf(["CHAIRPERSON", "MEMBER"]).required("Role is required"),
});

type FormValues = {
  name: string;
  wallet: string;
  role: "CHAIRPERSON" | "MEMBER";
};

const MemberForm = ({ organizationId }: { organizationId: string }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      if (!organizationId) {
        console.error("Organization ID is missing");
        return;
      }

      const response = await fetch("/api/group/members/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          organizationId, // Include the organization ID in the request body
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Member created:", result);
        reset(); // Reset the form fields after successful submission
        router.push(`/details?id=${organizationId}`);
      } else {
        console.error("Failed to add member");
        router.push(`/details?id=${organizationId}`);
      }
    } catch (error) {
      console.error("Error adding member:", error);
      router.push(`/details?id=${organizationId}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="wallet">Wallet Address</Label>
          <Input id="wallet" placeholder="0x12345678...." {...register("wallet")} />
          {errors.wallet && <p className="error-message">{errors.wallet.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="role">Role</Label>
          <Select onValueChange={value => setValue("role", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CHAIRPERSON">CHAIRPERSON</SelectItem>
              <SelectItem value="MEMBER">MEMBER</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && <p className="error-message">{errors.role.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="John Doe" {...register("name")} />
          {errors.name && <p className="error-message">{errors.name.message}</p>}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link
          href={`/details?id=${organizationId}`}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/90 h-10 px-4 py-2"
        >
          skip this step
        </Link>
        <Button type="submit">Add Member</Button>
      </CardFooter>
    </form>
  );
};

export default MemberForm;
