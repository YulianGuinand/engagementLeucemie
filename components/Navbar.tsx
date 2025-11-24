export default function Navbar() {
  return (
    <div className="fixed w-full top-0 left-0 h-16 py-4 px-8 bg-zinc-100 flex justify-center items-center border-b border-zinc-200 z-50">
      <div className="container mx-auto flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2 font-semibold">
          <span>Logo.</span>
          <div>Engagement Leucemie</div>
        </div>
      </div>
    </div>
  );
}
