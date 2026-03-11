import { Settings, Search, BookOpen, type LucideIcon } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const evaluationCriteria = [
  {
    icon: Settings,
    title: 'Entregas em Produção',
    description:
      'Automações, scrapers e integrações funcionando de verdade, usados pelo time no dia a dia.',
  },
  {
    icon: Search,
    title: 'Capacidade de Resolver',
    description:
      'Quando algo quebra, você investiga, resolve e documenta. Não espera alguém pedir.',
  },
  {
    icon: BookOpen,
    title: 'Documentação e Manutenção',
    description:
      'O que você constrói precisa ser entendido e mantido por outros. Código limpo, fluxos claros, zero caixa-preta.',
  },
];

function EvaluationCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <div
      ref={elementRef}
      className={`fade-in ${
        isVisible ? 'visible' : ''
      } p-12 pt-12 pb-12 bg-white rounded-2xl border-2 border-(--navy-deep) border-t-8 border-t-[#041293] shadow-[8px_8px_0_rgba(0,30,98,0.08)] transition-all duration-300 hover:shadow-[12px_12px_0_rgba(0,30,98,0.12)] hover:-translate-x-[2px] hover:-translate-y-[2px]`}
    >
      <Icon className="w-12 h-12 mb-6 text-[#041293]" />

      <h3 className="font-['Space_Grotesk'] text-2xl mb-4 text-(--navy-deep) font-bold">
        {title}
      </h3>
      <p className="text-(--text-faded) text-xl">{description}</p>
    </div>
  );
}

export function EvaluationSection() {
  const { elementRef: titleRef, isVisible: titleVisible } =
    useScrollAnimation();
  const { elementRef: subtitleRef, isVisible: subtitleVisible } =
    useScrollAnimation();

  return (
    <section className="py-24 relative bg-white">
      <div className="max-w-7xl mx-auto px-8 flex flex-col items-center justify-center gap-10">
        <div className="text-center flex flex-col items-center justify-center gap-4">
          <h2
            ref={titleRef}
            className={`fade-in ${
              titleVisible ? 'visible' : ''
            } font-['Space_Grotesk'] text-2xl lg:text-4xl font-black text-(--navy-deep) mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-[15px] after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-[5px] after:bg-(--navy-deep)`}
          >
            Como Avaliamos
          </h2>
          <p
            ref={subtitleRef}
            className={`fade-in ${
              subtitleVisible ? 'visible' : ''
            } text-lg lg:text-2xl text-(--text-faded) w-full mx-auto  leading-[1.8]`}
          >
            Transparência total. Sem surpresa. Sem discurso vazio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-12">
          {evaluationCriteria.map(criteria => (
            <EvaluationCard key={criteria.title} {...criteria} />
          ))}
        </div>
      </div>
    </section>
  );
}
