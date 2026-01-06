import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { DecorativeLine } from './DecorativeLine';

const evaluationCriteria = [
  {
    icon: '📊',
    title: 'Resultados Mensuráveis',
    description: 'Você será avaliado por entregas concretas, métricas claras e impacto real no crescimento da operação.',
  },
  {
    icon: '👥',
    title: 'Desenvolvimento da Equipe',
    description: 'Sua capacidade de treinar, elevar o nível médio e construir uma cultura de alta performance.',
  },
  {
    icon: '⚙️',
    title: 'Processos que Escalam',
    description: 'Estruturas que funcionam com ou sem você. Playbooks que podem ser replicados e melhorados continuamente.',
  },
];

function EvaluationCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <div
      ref={elementRef}
      className={`fade-in ${isVisible ? 'visible' : ''} p-12 pt-12 pb-12 bg-(--cream) border-[3px] border-(--navy-deep) border-t-8 border-t-(--burgundy) shadow-[8px_8px_0_rgba(0,30,98,0.08)] transition-all duration-300 hover:shadow-[12px_12px_0_rgba(0,30,98,0.12)] hover:-translate-x-[2px] hover:-translate-y-[2px]`}
    >
      <div className="w-[60px] h-[60px] bg-(--navy-deep) border-[3px] border-(--burgundy) flex items-center justify-center mb-6 text-[1.8rem]">
        {icon}
      </div>
      <h3 className="font-['Space_Grotesk'] text-[1.5rem] mb-4 text-(--navy-deep) font-bold">
        {title}
      </h3>
      <p className="text-(--text-faded)">{description}</p>
    </div>
  );
}

export function EvaluationSection() {
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { elementRef: subtitleRef, isVisible: subtitleVisible } = useScrollAnimation();

  return (
    <section className="py-24 relative bg-white">
      <div className="max-w-[1100px] mx-auto px-8">
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className={`fade-in ${titleVisible ? 'visible' : ''} font-['Space_Grotesk'] text-[clamp(2.2rem,5vw,3.8rem)] font-black text-(--navy-deep) mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-[15px] after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-[5px] after:bg-(--burgundy)`}
          >
            Como Avaliamos
          </h2>
          <DecorativeLine className="fade-in visible" />
          <p
            ref={subtitleRef}
            className={`fade-in ${subtitleVisible ? 'visible' : ''} text-[1.2rem] text-(--text-faded) max-w-[700px] mx-auto mt-8 leading-[1.8]`}
          >
            Somos transparentes desde o início. Sem surpresas. Sem discurso vazio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-12">
          {evaluationCriteria.map((criteria) => (
            <EvaluationCard key={criteria.title} {...criteria} />
          ))}
        </div>
      </div>
    </section>
  );
}

