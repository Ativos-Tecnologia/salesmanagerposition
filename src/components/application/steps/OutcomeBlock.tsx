import { CheckboxField } from '../CheckboxField';
import { TextAreaField } from '../TextAreaField';

interface OutcomeBlockProps {
  id: string;
  subtitle: string;
  title: string;
  description: React.ReactNode;
  criteria?: React.ReactNode;
  highlight?: string;
  accepted: boolean;
  comment: string;
  onAcceptedChange: (accepted: boolean) => void;
  onCommentChange: (comment: string) => void;
}

export function OutcomeBlock({
  id,
  subtitle,
  title,
  description,
  criteria,
  highlight,
  accepted,
  comment,
  onAcceptedChange,
  onCommentChange,
}: OutcomeBlockProps) {
  return (
    <div className="mb-10 p-8 bg-white border-2 border-[#e0e7ef] rounded transition-all hover:border-[#00e676] hover:shadow-[0_4px_20px_rgba(0,230,118,0.1)]">
      <div className="text-base text-[#546e7a] font-semibold mb-4 uppercase tracking-wider">
        {subtitle}
      </div>
      <h3 className="text-[22px] font-bold text-[#0a0e27] mb-4">{title}</h3>
      <div className="mb-4">{description}</div>
      
      {criteria && (
        <div className="bg-[#f1f8f4] p-5 my-5 border-l-4 border-[#00e676]">
          <div className="font-bold text-[#0a0e27] mb-3 text-base uppercase tracking-wider">
            Critério de Sucesso
          </div>
          {criteria}
        </div>
      )}
      
      {highlight && (
        <div className="bg-[#fff3e0] border-l-4 border-[#ffd600] p-4 my-5 font-semibold text-[#0a0e27]">
          {highlight}
        </div>
      )}

      <CheckboxField
        id={id}
        checked={accepted}
        onChange={onAcceptedChange}
        label="Eu sou capaz de entregar esses resultados"
      />

      <TextAreaField
        id={`${id}-comment`}
        value={comment}
        onChange={onCommentChange}
        label="Por que você acredita ser capaz de entregar este outcome?"
        placeholder="Compartilhe sua reflexão..."
        required
        minChars={150}
        error={comment.length > 0 && comment.length < 150}
      />
    </div>
  );
}

