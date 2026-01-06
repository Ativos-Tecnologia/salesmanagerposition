import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { FeaturesSectionDemo } from './gridPattern';

const autonomyItems = [
  'Estruturar operações inbound e outbound do zero',
  'Definir scripts, cadências e processos comerciais',
  'Treinar o time e elevar o nível médio da operação',
  'Trabalhar diretamente com liderança e áreas estratégicas',
  'Criar processos que escalam sem depender de você o tempo todo',
];

function AutonomyItem({ text }: { text: string }) {
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <li
      ref={elementRef}
      className={`fade-in ${isVisible ? 'visible' : ''} p-8 pl-16 mb-6 bg-white border-[3px] border-(--navy-deep) border-l-12 border-l-(--burgundy) text-[1.1rem] relative transition-all duration-300 shadow-[5px_5px_0_rgba(0,30,98,0.08)] hover:bg-(--cream) hover:shadow-[8px_8px_0_rgba(0,30,98,0.12)] hover:translate-x-[5px] before:content-['✓'] before:absolute before:left-6 before:top-1/2 before:-translate-y-1/2 before:text-(--burgundy) before:font-bold before:text-[1.8rem]`}
    >
      {text}
    </li>
  );
}

export function AutonomySection() {
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { elementRef: introRef, isVisible: introVisible } = useScrollAnimation();

  return (
    <section className="py-24 relative bg-(--off-white)">
      <div className="max-w-7xl mx-auto px-8 flex flex-col items-center justify-center gap-10">
        <div className="text-center flex flex-col items-center justify-center gap-6">
          <h2
            ref={titleRef}
            className={`fade-in ${titleVisible ? 'visible' : ''} font-['Space_Grotesk'] text-4xl font-black text-(--navy-deep) `}
          >
            Autonomia com Responsabilidade
          </h2>
        
        </div>

        <div className="max-w-[800px] mx-auto">
          <div
            ref={introRef}
            className={`fade-in ${introVisible ? 'visible' : ''} text-2xl text-[#515151] text-center `}
          >
            <strong>Você terá autonomia real para criar um novo pilar de crescimento da empresa.</strong> 
            Não buscamos alguém para rodar operação — buscamos alguém para construir.
          </div>
          <FeaturesSectionDemo />
          <ul className="list-none ">
            {autonomyItems.map((item) => (
              <AutonomyItem key={item} text={item} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

