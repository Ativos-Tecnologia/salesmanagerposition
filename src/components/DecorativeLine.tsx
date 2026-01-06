interface DecorativeLineProps {
  className?: string;
}

export function DecorativeLine({ className = '' }: DecorativeLineProps) {
  return (
    <div className={`relative w-[120px] h-[3px] bg-(--burgundy) mx-auto my-8 ${className}`}>
      <span className="absolute top-1/2 -translate-y-1/2 -left-[15px] w-2 h-2 bg-(--burgundy) rounded-full" />
      <span className="absolute top-1/2 -translate-y-1/2 -right-[15px] w-2 h-2 bg-(--burgundy) rounded-full" />
    </div>
  );
}

