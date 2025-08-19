/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@components/ui/button";
import FormField from "@components/ui/form-field";
import { Label } from "@components/ui/label";
import { PasswordInput } from "@components/ui/password-input";
import { BorderedWrapper } from "@/components/wrapper";
import Link from "next/link";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema } from "@/lib/schema";
import { RegistrationFormInputs } from "@/lib/types";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signUpAction } from "@/lib/actions";
import { signIn } from "next-auth/react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormInputs>({
    resolver: zodResolver(registrationSchema),
  });
  const router = useRouter();
  const onSubmit = async (data: FieldValues) => {
    console.log(data, "SIGN UP DATA");

    const response = await signUpAction({
      username: data.username,
      email: data.email,
      bio: data.bio,
      password: data.password,
    });
    console.log(response, "SIGN UP RESPONSE");
    if (response) {
      if (response.status === "success") {
        toast.success(response.message);
        await signIn("credentials", {
          redirect: false,
          email: data.email,
          password: data.password,
        });
        router.push("/challenges");
      } else {
        toast.error(response.message);
      }
    }
  };
  console.log(errors, "ERRORS");
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-[650px] w-full mx-auto"
    >
      <BorderedWrapper label="Enter your details">
        <div className="grid gap-2">
          <Label>Username</Label>
          <FormField
            register={register}
            type="text"
            placeholder="Provide a username"
            name="username"
            error={errors["username"]}
          />
        </div>
        <div className="grid gap-2">
          <Label>Email</Label>
          <FormField
            register={register}
            type="email"
            placeholder="Email"
            name="email"
            error={errors["email"]}
          />
        </div>
        <div className="grid gap-2">
          <Label>Bio</Label>

          <Textarea
            className={cn(
              "w-full placeholder:text-primary_color border-primary_color bg-transparent",
              {
                "border border-red-400": errors["bio"],
              }
            )}
            placeholder={"Tell us about yourself (optional)"}
            {...register("bio")}
          />
        </div>

        <div className="grid gap-2">
          <Label>Password</Label>
          <PasswordInput
            error={errors["password"]}
            register={register}
            name={"password"}
            placeholder="XXXXXXXX"
          />
        </div>
        <div className="grid gap-2">
          <Label>Confirm Password</Label>
          <PasswordInput
            error={errors["confirmPassword"]}
            register={register}
            name="confirmPassword"
            placeholder="XXXXXXXX"
          />
        </div>
      </BorderedWrapper>

      <div className="flex text-sm mt-4 text-center mx-auto flex-col gap-4">
        <span>
          Already registerd ?{" "}
          <Link href={"/sign-in"} className="hover:underline">
            Sign in from here
          </Link>
        </span>
        <Button
          disabled={isSubmitting}
          type="submit"
          className="group w-full mx-auto max-w-[650px]"
          variant={"default"}
        >
          Register
        </Button>
      </div>
    </form>
  );
}
