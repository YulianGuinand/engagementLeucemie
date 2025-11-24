import { ReactNode } from "react";

export default function Button({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="py-2 px-4 rounded-full border-2 border-[#29a64e] cursor-pointer hover:border-[#dd6d1d] transition-colors font-semibold"
    >
      {children}
    </button>
  );
}
