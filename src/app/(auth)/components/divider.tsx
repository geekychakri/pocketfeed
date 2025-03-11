export default function Divider({ text }: { text?: string }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-border-non-interactive"></span>
      </div>
      <div className="relative flex justify-center">
        <span className="bg-background-primary px-2 text-text-secondary">
          {text}
        </span>
      </div>
    </div>
  );
}
