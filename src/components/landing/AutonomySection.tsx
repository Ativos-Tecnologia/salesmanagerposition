import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { Grid } from './gridPattern';

const grid = [
  {
    title: 'Estruturar operações inbound e outbound do zero',
  },
  {
    title: 'Definir scripts, cadências e processos comerciais',
  },
  {
    title: 'Treinar o time e elevar o nível médio da operação',
  },
  {
    title: 'Trabalhar diretamente com liderança e áreas estratégicas',
  },
  {
    title: 'Criar processos que escalam sem depender de você o tempo todo',
  },
];

export function AutonomySection() {
  const { elementRef: titleRef, isVisible: titleVisible } =
    useScrollAnimation();
  const { elementRef: introRef, isVisible: introVisible } =
    useScrollAnimation();

  return (
    <section className="py-24 relative bg-(--off-white)">
      <div className="max-w-7xl mx-auto px-8 flex flex-col items-center justify-center gap-10">
        <div className="text-center flex flex-col items-center justify-center gap-6">
          <h2
            ref={titleRef}
            className={`fade-in ${
              titleVisible ? 'visible' : ''
            } font-['Space_Grotesk'] text-2xl lg:text-4xl font-black text-(--navy-deep) `}
          >
            Autonomia com Responsabilidade
          </h2>
          <div className="max-w-[800px] mx-auto">
            <div
              ref={introRef}
              className={`fade-in ${
                introVisible ? 'visible' : ''
              } text-lg lg:text-2xl text-[#515151] text-center `}
            >
              <strong>
                Você terá autonomia real para criar um novo pilar de crescimento
                da empresa.
              </strong>
              Não buscamos alguém para rodar operação — buscamos alguém para
              construir.
            </div>
          </div>
        </div>

        <div className="max-w-[800px] mx-auto">
          <div className=" mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-10 md:gap-10 max-w-7xl mx-auto">
              {grid.map(feature => (
                <div
                  key={feature.title}
                  className="relative bg-linear-to-b dark:from-neutral-900 from-neutral-100 dark:to-neutral-950 to-white p-6 rounded-3xl overflow-hidden shadow-[5px_5px_0_rgba(0,30,98,0.08)] hover:bg-(--cream) hover:shadow-[8px_8px_0_rgba(0,30,98,0.12)] hover:translate-x-[5px] "
                >
                  <Grid size={20} />
                  <p className="text-base font-bold text-neutral-800 dark:text-white relative z-20">
                    {feature.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

