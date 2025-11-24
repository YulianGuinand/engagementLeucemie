import React, { ReactNode } from "react";

export default function Button({ children }: { children: ReactNode }) {
  return (
    <button className="py-2 px-4 rounded-full border-2 border-[#29a64e] cursor-pointer hover:border-[#dd6d1d] transition-colors font-semibold">
      {children}
    </button>
  );
}
