"use client";

import React, { useState } from "react";
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
      } else {
        console.error("Failed to add member");
      }
    } catch (error) {
      console.error("Error adding member:", error);
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
      <CardFooter className="flex justify-end">
        <Button type="submit">Add Member</Button>
      </CardFooter>
    </form>
  );
};

export default MemberForm;
