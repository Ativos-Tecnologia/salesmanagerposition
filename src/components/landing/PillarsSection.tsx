import { Landmark } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const pillars = [
  {
    number: '1',
    title: 'Alinhamento',
    description: 'Construir novas frentes dentro de empresas consolidadas. Se você gosta de desafios que aceleram carreira, este é o lugar.',
  },
  {
    number: '2',
    title: 'Flexibilidade',
    description: 'Cobrança clara por resultado. Ambiente direto. Pouca hierarquia, pouca política. Foco em execução.',
  },
  {
    number: '3',
    title: 'Liberdade',
    description: 'Autonomia real para estruturar do zero. Trabalho direto com liderança. Liberdade com responsabilidade proporcional.',
  },
  {
    number: '4',
    title: 'Ganhos',
    description: 'Fixo competitivo + variável agressivo. Upside claro para quem constrói algo que escala. Não há limites para crescer.',
  },
];

function PillarCard({ number, title, description }: { number: string; title: string; description: string }) {
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <div
      ref={elementRef}
      className={`fade-in ${isVisible ? 'visible' : ''} text-center p-12 pt-12 pb-12 bg-white/5 border rounded-2xl border-[#ffffff4b] relative transition-all duration-400 hover:bg-white/10 hover:border-(--cream)/40 hover:-translate-y-2 before:content-[''] before:absolute before:top-0 before:left-0  before:w-1/3 before:mx-auto before:right-0 before:h-[3px] before:bg-[#FFFFFF] before:scale-x-0 before:origin-left before:transition-transform before:duration-500 hover:before:scale-x-100 before:rounded-full`}
    >
      <div className="inline-block w-[70px] h-[70px] leading-[70px] bg-white border-[3px] border-[#FFFFFF] rounded-full font-['Space_Grotesk'] text-[2rem] font-black mb-6 text-[#041293]">
        {number}
      </div>
      <h3 className="font-['Space_Grotesk'] text-2xl mb-4 font-bold ">
        {title}
      </h3>
      <p className="text-[#d8d6cd] leading-[1.8]">{description}</p>
    </div>
  );
}

export function PillarsSection() {
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { elementRef: subtitleRef, isVisible: subtitleVisible } = useScrollAnimation();

  return (
    <section className="py-24 relative bg-[#041293] text-(--cream)">
      <div className="max-w-7xl mx-auto px-8  flex flex-col items-center justify-center gap-10">
        <Landmark className="text-[#FFFFFF]" size={60} />
        <div className="text-center flex flex-col items-center justify-center gap-6">
          <h2
            ref={titleRef}
            className={`fade-in ${
              titleVisible ? 'visible' : ''
            } font-['Space_Grotesk'] text-2xl lg:text-4xl font-black text-(--cream) `}
          >
            Os 4 Pilares Desta Posição
          </h2>

          <p
            ref={subtitleRef}
            className={`fade-in ${
              subtitleVisible ? 'visible' : ''
            } text-lg lg:text-2xl text-[#c8c6bd] max-w-[700px] mx-auto  leading-[1.8]`}
          >
            Construção real, responsabilidade real e impacto mensurável.
          </p>
          <div className="w-1/2 h-[2px] bg-[#ffffff4b] mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 ">
          {pillars.map(pillar => (
            <PillarCard key={pillar.number} {...pillar} />
          ))}
        </div>
      </div>
    </section>
  );
}

