"use client";
import { ReactTerminal } from "react-terminal";
import { TerminalContextProvider } from "react-terminal";
import Heading from "./heading";
import { commands } from "@/lib/data";

export default function Terminal() {
  return (
    <TerminalContextProvider>
      <div>
        <Heading>Terminal</Heading>
        <div className="h-96 w-full shadow-default-button-shadow">
          <ReactTerminal
            commands={commands}
            welcomeMessage="Type help to see available commands"
            themes={{
              "my-custom-theme": {
                themeBGColor: "#020A09",
                themeToolbarColor: "#09302E",
                themeColor: "#10A65A",
                themePromptColor: "#10A65A",
              },
            }}
            theme="my-custom-theme"
          />
        </div>
      </div>
    </TerminalContextProvider>
  );
}
