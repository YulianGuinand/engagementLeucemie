import React from "react";
import Button from "./Button";

export default function Navbar() {
  return (
    <div className="fixed w-full top-0 left-0 h-16 py-4 px-8 bg-lime-100 flex justify-center items-center">
      <div className="container mx-auto flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2 font-semibold">
          <span>Logo.</span>
          <div>Engagement Leucemie</div>
        </div>

        <Button>Telecharger</Button>
      </div>
    </div>
  );
}
