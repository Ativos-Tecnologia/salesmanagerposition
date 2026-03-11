import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { Grid } from './gridPattern';

const grid = [
  {
    title: 'Experiência prática com automações (n8n, Zapier, Make ou similar)',
  },
  {
    title: 'Saber fazer web scraping e lidar com sites que bloqueiam',
  },
  {
    title: 'Ter integrado APIs e construído endpoints',
  },
  {
    title: 'Saber usar IA (OpenAI, Gemini) dentro de fluxos reais',
  },
  {
    title: 'Conseguir manter o que construiu rodando em produção',
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
            O Que Esperamos de Você
          </h2>
          <div className="max-w-[800px] mx-auto">
            <div
              ref={introRef}
              className={`fade-in ${
                introVisible ? 'visible' : ''
              } text-lg lg:text-2xl text-[#515151] text-center `}
            >
              <strong>Alguém que já construiu coisas de verdade.</strong> Não
              precisa ser sênior. Precisa ser alguém que resolve, aprende rápido
              e não empurra problema pra frente.
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

