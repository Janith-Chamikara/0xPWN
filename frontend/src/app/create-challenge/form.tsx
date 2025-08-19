/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@components/ui/button";
import FormField from "@components/ui/form-field";
import { Label } from "@components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Controller, FieldValues, useForm } from "react-hook-form";
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
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
    control,
    reset,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createChallengeSchema),
    defaultValues: {
      uploadThumbnail: false,
    },
  });
  const router = useRouter();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const uploadThumbnail = watch("uploadThumbnail");

  useEffect(() => {
    const isEdit = searchParams.get("edit");
    const id = searchParams.get("id");
    console.log(isEdit, id, "EDIT PARAMS");
    const fetchChallenge = async () => {
      const response = await getChallengeById(id as string);
      if (response) {
        if (response.status === "success") {
          const challengeResponse = response.data as Challenge;
          reset({
            title: challengeResponse.title,
            description: challengeResponse.description,
            category_id: challengeResponse.category_id,
            resources: challengeResponse.resources,
            difficulty: challengeResponse.difficulty as
              | "Easy"
              | "Medium"
              | "Hard",
            points: String(challengeResponse.points),
            uploadThumbnail: false, // Reset to false for edit mode
          });
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

  const handleThumbnailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("thumbnail", file);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
    } else {
      setValue("thumbnail", undefined);
      setThumbnailPreview(null);
    }
  };

  const onSubmit = async (data: FieldValues) => {
    console.log(data, "CREATE CHALLENGE DATA");

    if (!session?.user?.user_id) {
      toast.error("You must be logged in to create a challenge.");
      return;
    }

    // Create FormData if thumbnail is uploaded
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === "thumbnail" && data.uploadThumbnail && data[key]) {
        formData.append("thumbnail", data[key]);
      } else if (key !== "thumbnail" && key !== "uploadThumbnail") {
        formData.append(key, data[key]);
      }
    });
    formData.append("created_by", session.user.user_id);

    if (searchParams.get("edit") === "true") {
      const response = await updateChallenge(
        formData,
        searchParams.get("id") as string
      );

      if (response?.status === "success") {
        toast.success("Challenge updated successfully!");
        router.push("/challenges");
      } else {
        toast.error(response?.message || "Failed to update challenge.");
      }
    } else {
      const response = await createChallenge(formData);
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
      className="flex flex-col gap-4 mx-auto"
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
          <span className="text-xs text-red-400">
            {errors["description"].message as string}
          </span>
        )}
      </div>

      <div className="grid gap-2">
        <Controller
          name="category_id"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
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
          )}
        />
        {errors["category_id"] && (
          <span className="text-xs text-red-400">
            {errors["category_id"].message as string}
          </span>
        )}
      </div>

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
        <Controller
          name="difficulty"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
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
                {["Easy", "Medium", "Hard"].map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors["difficulty"] && (
          <span className="text-xs text-red-400">
            {errors["difficulty"].message as string}
          </span>
        )}
      </div>

      {/* Thumbnail Upload Section */}
      <div className="grid gap-4">
        <div className="flex items-center space-x-2">
          <Controller
            name="uploadThumbnail"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="uploadThumbnail"
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  if (!checked) {
                    setValue("thumbnail", undefined);
                    setThumbnailPreview(null);
                  }
                }}
              />
            )}
          />
          <Label htmlFor="uploadThumbnail">Upload thumbnail image</Label>
        </div>

        {uploadThumbnail && (
          <div className="grid gap-2">
            <Label>Thumbnail Image</Label>
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleThumbnailChange}
              className={cn(
                "w-full file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary_color file:text-white hover:file:bg-primary_color/90",
                {
                  "border border-red-400": errors["thumbnail"],
                }
              )}
            />
            {errors["thumbnail"] && (
              <span className="text-xs text-red-400">
                {errors["thumbnail"].message as string}
              </span>
            )}

            {thumbnailPreview && (
              <div className="mt-2">
                <Label className="text-sm text-primary_color">Preview:</Label>
                <div className="mt-1 border border-primary_color rounded-md p-2 bg-transparent">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="max-w-xs max-h-32 object-cover rounded"
                  />
                </div>
              </div>
            )}
          </div>
        )}
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
