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
  checkboxLabel?: string;
  commentLabel?: string;
  commentMinChars?: number;
  showComment?: boolean;
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
  checkboxLabel = 'Entendi e me comprometo a entregar',
  commentLabel = 'Já fez algo parecido? Conte brevemente.',
  commentMinChars = 80,
  showComment = true,
}: OutcomeBlockProps) {
  return (
    <div className="mb-10 p-8 bg-white border-2 border-[#e0e7ef] rounded transition-all hover:border-[#3b82f6] hover:shadow-[0_4px_20px_rgba(59,130,246,0.1)]">
      <div className="text-base text-[#546e7a] font-semibold mb-4 uppercase tracking-wider">
        {subtitle}
      </div>
      <h3 className="text-[22px] font-bold text-[#0a0e27] mb-4">{title}</h3>
      <div className="mb-4">{description}</div>

      {criteria && (
        <div className="bg-[#eff6ff] p-5 my-5 border-l-4 border-[#3b82f6]">
          <div className="font-bold text-[#0a0e27] mb-3 text-base uppercase tracking-wider">
            Como sabemos que deu certo
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
        label={checkboxLabel}
      />

      {showComment && (
        <TextAreaField
          id={`${id}-comment`}
          value={comment}
          onChange={onCommentChange}
          label={commentLabel}
          placeholder="Pode ser curto e direto..."
          required
          minChars={commentMinChars}
          error={comment.length > 0 && comment.length < commentMinChars}
        />
      )}
    </div>
  );
}
