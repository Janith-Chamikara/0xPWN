/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@components/ui/button";
import FormField from "@components/ui/form-field";
import { Label } from "@components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { createChallengeSchema } from "@/lib/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  createChallenge,
  getAllCategories,
  getChallengeById,
  updateChallenge,
} from "@/lib/actions";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { CategoryResponse, Challenge, Status } from "@/lib/types";
import { useEffect, useState } from "react";

export default function CreateChallengeForm() {
  const {
    register,
    reset,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createChallengeSchema),
  });
  const router = useRouter();

  const [challenge, setChallenge] = useState<Challenge | null>(null);

  const searchParams = useSearchParams();
  useEffect(() => {
    const isEdit = searchParams.get("edit");
    const id = searchParams.get("id");
    console.log(isEdit, id, "EDIT PARAMS");
    const fetchChallenge = async () => {
      const response = await getChallengeById(id as string);
      if (response) {
        if (response.status === "success") {
          reset(response.data);
          setChallenge(response.data as Challenge);
          console.log(response.data, "CHALLENGE DATA");
        } else {
          console.error("Failed to fetch challenge data");
        }
      }
    };
    fetchChallenge();
  }, []);

  const { data: session } = useSession();

  const { data, isLoading } = useQuery<Status | undefined>({
    queryKey: ["categories"],
    queryFn: () => getAllCategories(),
  });
  console.log(data, "CATEGORIES DATA");
  const availableCategories = (data?.data as CategoryResponse[]) ?? [];

  const onSubmit = async (data: FieldValues) => {
    console.log(data, "CREATE CHALLENGE DATA");

    if (!session?.user?.user_id) {
      toast.error("You must be logged in to create a challenge.");
    }
    if (searchParams.get("edit") === "true") {
      const response = await updateChallenge(
        { ...data, created_by: session?.user.user_id },
        searchParams.get("id") as string
      );

      if (response?.status === "success") {
        toast.success("Challenge created successfully!");
        router.push("/challenges");
      } else {
        toast.error(response?.message || "Failed to create challenge.");
      }
    } else {
      const response = await createChallenge({
        ...data,
        created_by: session?.user.user_id,
      });
      if (response?.status === "success") {
        toast.success("Challenge created successfully!");
        router.push("/challenges");
      } else {
        toast.error(response?.message || "Failed to create challenge.");
      }
    }
  };
  const resources = watch("resources");
  console.log(resources, "RESOURCES");
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4  mx-auto"
    >
      <div className="grid gap-2">
        <Label>Title</Label>
        <FormField
          register={register}
          type="text"
          placeholder="Challenge title"
          name="title"
          error={errors["title"]}
        />
      </div>

      <div className="grid gap-2">
        <Label>Description</Label>
        <Textarea
          className={cn(
            "w-full placeholder:text-primary_color border-primary_color bg-transparent",
            {
              "border border-red-400": errors["description"],
            }
          )}
          placeholder="Describe the challenge"
          {...register("description")}
        />
        {errors["description"] && (
          <span className=" text-xs text-red-400">
            {errors["description"].message as string}
          </span>
        )}
      </div>

      <div className="grid gap-2">
        <Select
          defaultValue={challenge ? challenge.category_id : ""}
          onValueChange={(value) => setValue("category_id", value)}
        >
          <SelectTrigger
            className={cn(
              "w-full placeholder:text-primary_color border-primary_color bg-transparent",
              {
                "border border-red-400": errors["category_id"],
              }
            )}
          >
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {availableCategories.map((category) => (
              <SelectItem
                key={category.category_id}
                value={category.category_id}
              >
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* <div>
        <RadioGroup
          value={resources}
          onValueChange={(val) => setValue("resources", val)}
          className="flex items-center gap-4"
        >
          <div className="flex items-center gap-3">
            <RadioGroupItem value="FILES" id="r1" />
            <Label htmlFor="r1">Files</Label>
          </div>
          <div className="flex items-center gap-3">
            <RadioGroupItem value="LINK" id="r2" />
            <Label htmlFor="r2">Links</Label>
          </div>
        </RadioGroup>
      </div> */}

      {/* {resources === "FILES" && (
        <div className="grid gap-2">
          <Label>Upload Files</Label>
          <Input
            type="file"
            className="border text-white placeholder:text-white border-primary_color bg-transparent p-2 rounded"
            multiple
          />
        </div>
      )} */}

      <div className="grid gap-2">
        <Label>Add file link</Label>
        <FormField
          type="text"
          register={register}
          placeholder="Challenge resources link"
          name="resources"
          error={errors["resources"]}
        />
      </div>

      <div className="grid gap-2">
        <Select
          defaultValue={challenge ? challenge.difficulty : ""}
          onValueChange={(value) =>
            setValue("difficulty", value as "Easy" | "Medium" | "Hard")
          }
        >
          <SelectTrigger
            className={cn(
              "w-full placeholder:text-primary_color border-primary_color bg-transparent",
              {
                "border border-red-400": errors["difficulty"],
              }
            )}
          >
            <SelectValue placeholder="Select difficulty level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label>Points</Label>
        <FormField
          register={register}
          type="number"
          placeholder="Challenge points"
          name="points"
          error={errors["points"]}
        />
      </div>

      <div className="grid gap-2">
        <Label>Flag</Label>
        <FormField
          register={register}
          type="text"
          placeholder="Enter the flag"
          name="flag"
          error={errors["flag"]}
        />
      </div>

      <Button
        disabled={isSubmitting}
        type="submit"
        className="group w-full"
        variant={"default"}
      >
        {searchParams.get("edit") === "true"
          ? "Update Challenge"
          : "Create Challenge"}
      </Button>
    </form>
  );
}
