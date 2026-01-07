import { OctagonAlert, X } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const dealbreakers = [
  'Você só funciona com operação pronta e estruturada',
  'Você evita liderar pessoas e desenvolver equipes',
  'Você se incomoda com metas claras e cobrança objetiva',
  'Você busca estabilidade sem desafio estratégico',
];

function DealBreakerItem({ text }: { text: string }) {
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <div ref={elementRef} className={`fade-in ${isVisible ? 'visible' : ''} `}>
      <div className="flex justify-center gap-8 items-center  ">
        <X size={30} className="text-[#ffffff] size-16 lg:size-10" />
        <p className="text-lg lg:text-xl leading-[1.6]">{text}</p>
      </div>
    </div>
  );
}

export function DealbreakersSection() {
  const { elementRef: titleRef, isVisible: titleVisible } =
    useScrollAnimation();
  const { elementRef: subtitleRef, isVisible: subtitleVisible } =
    useScrollAnimation();
  const { elementRef: warningRef, isVisible: warningVisible } =
    useScrollAnimation();

  return (
    <section className="py-24 relative bg-[#C02626] text-(--cream)">
      {/* Background Pattern */}
      <div
        className="absolute bottom-0 left-0 w-full h-full pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 35px,
            rgba(0, 0, 0, 0.03) 35px,
            rgba(0, 0, 0, 0.03) 70px
          )`,
        }}
      />

      <div className="max-w-7xl mx-auto px-8 flex flex-col items-center justify-center gap-10">
        <div className="text-center flex flex-col items-center justify-center gap-10">
          <OctagonAlert size={60} className="text-[#ffffff]" />
          <div>
            <h2
              ref={titleRef}
              className={`fade-in ${
                titleVisible ? 'visible' : ''
              } font-['Space_Grotesk'] text-2xl lg:text-4xl font-black text-(--cream) relative inline-block after:content-[''] after:absolute after:-bottom-[15px] after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-[2px] after:bg-[#ffffff4b]`}
            >
              Esta Vaga NÃO É Para Você Se...
            </h2>
            <p
              ref={subtitleRef}
              className={`fade-in ${
                subtitleVisible ? 'visible' : ''
              } text-lg lg:text-2xl text-[#FFFFFF] max-w-[700px] mx-auto mt-8 leading-[1.8]`}
            >
              Seja honesto consigo mesmo antes de avançar. Este papel exige
              perfil específico.
            </p>
          </div>
        </div>

        <div className="border-2 border-border rounded-2xl p-10 max-w-7xl mx-auto flex flex-col items-start justify-center gap-8">
          {dealbreakers.map(item => (
            <DealBreakerItem key={item} text={item} />
          ))}
        </div>
        <div
          ref={warningRef}
          className={`fade-in ${
            warningVisible ? 'visible' : ''
          } p-4 bg-white border rounded-full border-(--navy-deep) border-l-4 border-l-[#000000] shadow-[8px_8px_0_rgba(0,30,98,0.1)] transition-all duration-400 relative hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0_rgba(0,30,98,0.15)]`}
        >
          <h3 className="font-['Space_Grotesk'] text-lg lg:text-2xl text-center lg:text-left text-[#C02626] font-bold p-2">
            Este é um papel para quem quer construir, não apenas manter
          </h3>
        </div>
      </div>
    </section>
  );
}
