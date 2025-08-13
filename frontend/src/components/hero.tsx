import Image from "next/image";
import hacker from "@public/hacker.png";
import NavigateButton from "@components/navigate-button";
export default function Hero() {
  return (
    <div>
      <div className="h-screen w-full inset-0 mx-auto flex flex-col gap-12 md:gap-0 md:flex-row items-center justify-center md:justify-between z-[50]">
        <div className="flex sm:w-1/2 order-2 md:order-1 flex-col gap-8 justify-start">
          <h1 className="bg-[#020A09] bg-heading-text-gradient lg:max-w-[692px] bg-clip-text  text-[24px] lg:text-[48px] font-[400] text-transparent text-center md:text-left">
            We see things others ignore.
          </h1>
          <h1 className="bg-[#020A09] bg-heading-text-gradient lg:max-w-[692px] bg-clip-text  text-[24px] lg:text-[48px] font-[400] text-transparent text-center md:text-left">
            {" "}
            -- .- -.- . / -.-- --- ..- .-. / -- --- ...- .
          </h1>

          <p className="text-justify md:text-left text-primary_color">
            Enter a world where every click is a clue, every challenge hides a
            cipher, and only the curious survive.
          </p>
          <NavigateButton navigateTo="/sign-in" className="w-full">
            Start your journey
          </NavigateButton>
        </div>
        <Image
          src={hacker}
          width={920}
          height={920}
          alt="Image of a hacker"
          className="sm:w-1/2 bg-transparent order-1 md:order-2"
          objectFit="cover"
        />
      </div>
    </div>
  );
}
