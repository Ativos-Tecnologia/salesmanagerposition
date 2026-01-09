import { RatingScale } from '../RatingScale';
import { TextAreaField } from '../TextAreaField';

interface CompetencyBlockProps {
  title: string;
  value: string;
  description: React.ReactNode;
  highlight?: string;
  rating: string;
  example: string;
  onRatingChange: (rating: string) => void;
  onExampleChange: (example: string) => void;
}

export function CompetencyBlock({
  title,
  value,
  description,
  highlight,
  rating,
  example,
  onRatingChange,
  onExampleChange,
}: CompetencyBlockProps) {
  return (
    <div className="mb-12 p-8 bg-white border-2 border-[#e0e7ef] rounded">
      <div className="mb-5">
        <h3 className="text-2xl font-bold text-[#0a0e27] mb-2">{title}</h3>
        <div className="text-base font-semibold text-[#3b82f6] mb-4 uppercase tracking-wider">
          {value}
        </div>
        <div className="text-[#0a0e27]">{description}</div>
        {highlight && (
          <div className="bg-[#fff3e0] border-l-4 border-[#ffd600] p-4 my-5 font-semibold text-[#0a0e27]">
            {highlight}
          </div>
        )}
      </div>

      <RatingScale name={`rating-${title}`} value={rating} onChange={onRatingChange} />

      <TextAreaField
        id={`example-${title}`}
        value={example}
        onChange={onExampleChange}
        label="Descreva um exemplo concreto"
        placeholder="Descreva uma situação específica..."
        required
        minChars={200}
        error={example.length > 0 && example.length < 200}
      />
    </div>
  );
}

