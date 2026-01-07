interface RatingScaleProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
}

const ratings = [
  { value: '1', label: 'Não me identifico' },
  { value: '2', label: 'Pouco' },
  { value: '3', label: 'Moderado' },
  { value: '4', label: 'Muito' },
  { value: '5', label: 'Totalmente' },
];

export function RatingScale({ name, value, onChange }: RatingScaleProps) {
  return (
    <div className="flex gap-3 my-6 flex-wrap md:flex-nowrap">
      {ratings.map((rating) => (
        <div key={rating.value} className="flex-1 min-w-[120px] relative">
          <input
            type="radio"
            id={`${name}-${rating.value}`}
            name={name}
            value={rating.value}
            checked={value === rating.value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute opacity-0"
          />
          <label
            htmlFor={`${name}-${rating.value}`}
            className={`flex flex-col items-center p-4 border-2 rounded cursor-pointer transition-all ${
              value === rating.value
                ? 'border-[#00e676] bg-linear-to-br from-[#f1f8f4] to-white'
                : 'border-[#e0e7ef] bg-white'
            } hover:border-[#00c853] hover:-translate-y-0.5`}
          >
            <span
              className={`text-[28px] font-bold mb-1 ${
                value === rating.value ? 'text-[#00e676]' : 'text-[#546e7a]'
              }`}
            >
              {rating.value}
            </span>
            <span className="text-xs text-[#78909c] text-center font-semibold">
              {rating.label}
            </span>
          </label>
        </div>
      ))}
    </div>
  );
}

