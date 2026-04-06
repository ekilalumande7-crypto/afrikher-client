export default function AccountLoadingBlock() {
  return (
    <div className="border border-black/8 bg-[#FBF7F0] p-8 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
      <div className="animate-pulse space-y-4">
        <div className="h-3 w-32 bg-[#ECE4D7]" />
        <div className="h-10 w-60 bg-[#ECE4D7]" />
        <div className="h-24 bg-[#ECE4D7]" />
        <div className="h-24 bg-[#ECE4D7]" />
      </div>
    </div>
  );
}
