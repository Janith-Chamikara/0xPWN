"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FormField from "@/components/ui/form-field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Status, WriteUpFormInputs } from "@/lib/types";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { writeupFormSchema } from "@/lib/schema";
import { useSession } from "next-auth/react";
import { createWriteup } from "@/lib/actions";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

interface WriteupDialogFormProps {
  trigger?: React.ReactNode;
  isEdit?: boolean;
  challengeId: string;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<Status | undefined, Error>>;
}

export default function WriteupDialogForm({
  trigger,
  isEdit = false,
  refetch,
  challengeId,
}: WriteupDialogFormProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WriteUpFormInputs>({
    resolver: zodResolver(writeupFormSchema),
  });

  const { data: session } = useSession();

  const handleFormSubmit = async (data: WriteUpFormInputs) => {
    if (!session?.user.user_id) {
      toast.error("You must be logged in to create a writeup.");
      return;
    }
    const response = await createWriteup({
      ...data,
      user_id: session?.user.user_id || "",
      challenge_id: challengeId,
    });
    if (response) {
      if (response.status === "success") {
        toast.success("Writeup created successfully!");
        refetch();
      } else {
        toast.error(response.message || "Failed to create writeup.");
      }
    }
  };

  console.log(errors, "Form errors");

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="default" className="w-full">
            {isEdit ? "Edit Writeup" : "Create Writeup"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-black/90 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-primary_color">
            {isEdit ? "Edit Writeup" : "Create New Writeup"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isEdit
              ? "Update your writeup details below."
              : "Share your knowledge by creating a new writeup."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Title Field */}
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Title
              </Label>
              <FormField
                register={register}
                type="text"
                placeholder="Enter writeup title..."
                name="title"
                error={errors.title}
              />
            </div>

            {/* Content Field */}
            <div className="grid gap-2">
              <Label htmlFor="content" className="text-sm font-medium">
                Content
              </Label>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <div>
                    <Textarea
                      {...field}
                      placeholder="Write your detailed writeup content here..."
                      className={cn(
                        "min-h-[200px] bg-transparent placeholder:text-primary_color border-primary_color resize-none",
                        {
                          "border border-red-400": errors.content,
                        }
                      )}
                    />
                    {errors.content && (
                      <span className="text-xs text-red-400">
                        {errors.content.message}
                      </span>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Visibility Field */}
            <div className="grid gap-3">
              <Label className="text-sm font-medium">Visibility</Label>
              <Controller
                name="visibility"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="PUBLIC" id="public" />
                      <Label
                        htmlFor="public"
                        className="text-sm font-normal cursor-pointer"
                      >
                        Public
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        className="text-primary_color"
                        value="PRIVATE"
                        id="private"
                      />
                      <Label
                        htmlFor="private"
                        className="text-sm font-normal cursor-pointer"
                      >
                        Private
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              />
              {errors.visibility && (
                <span className="text-xs text-red-400">
                  {errors.visibility.message}
                </span>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="default"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={isSubmitting}
              className="min-w-[100px]"
            >
              {isSubmitting
                ? "Saving..."
                : isEdit
                ? "Update Writeup"
                : "Create Writeup"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
