import Heading from "@/components/heading";
import LoginForm from "./form";

export default function LoginPage() {
  return (
    <main className="max-w-7xl mx-auto">
      <div className="mt-[60px]">
        <Heading>AUTH REQUIRED</Heading>

        <LoginForm />
      </div>
    </main>
  );
}
