import Image from "next/image";

export default function Navbar() {
  return (
    <div className="fixed w-full top-0 left-0 h-16 py-4 px-8 bg-zinc-100 flex justify-center items-center border-b border-zinc-200 z-50">
      <div className="container mx-auto flex flex-row justify-between items-center">
        <a
          href="https://engagement-leucemie.com/"
          className="flex flex-row gap-4 font-semibold items-center"
        >
          <Image src="/logo.png" alt="Logo" width={50} height={50} />
          <div>Engagement Leucemie</div>
        </a>
      </div>
    </div>
  );
}
