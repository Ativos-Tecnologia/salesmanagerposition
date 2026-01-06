import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { DecorativeLine } from './DecorativeLine';

const dealbreakers = [
  'Você só funciona com operação pronta e estruturada',
  'Você evita liderar pessoas e desenvolver equipes',
  'Você se incomoda com metas claras e cobrança objetiva',
  'Você busca estabilidade sem desafio estratégico',
];

function DealBreakerItem({ text }: { text: string }) {
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <div
      ref={elementRef}
      className={`fade-in ${isVisible ? 'visible' : ''} p-10 pt-10 pb-10 bg-black/20 border-[3px] border-(--cream)/30 text-center transition-all duration-300 relative hover:bg-black/35 hover:border-(--cream) hover:scale-105 before:content-['✕'] before:block before:text-[3.5rem] before:mb-4 before:text-(--cream) before:font-bold before:opacity-40`}
    >
      <p className="text-[1.05rem] leading-[1.6]">{text}</p>
    </div>
  );
}

export function DealbreakersSection() {
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { elementRef: subtitleRef, isVisible: subtitleVisible } = useScrollAnimation();
  const { elementRef: warningRef, isVisible: warningVisible } = useScrollAnimation();

  return (
    <section className="py-24 relative bg-(--burgundy) text-(--cream)">
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

      <div className="max-w-[1100px] mx-auto px-8 relative z-10">
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className={`fade-in ${titleVisible ? 'visible' : ''} font-['Space_Grotesk'] text-[clamp(2.2rem,5vw,3.8rem)] font-black text-(--cream) mb-6 relative inline-block after:content-[''] after:absolute after:-bottom-[15px] after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-[5px] after:bg-(--burgundy)`}
          >
            Esta Vaga NÃO É Para Você Se...
          </h2>
          <DecorativeLine className="fade-in visible" />
          <p
            ref={subtitleRef}
            className={`fade-in ${subtitleVisible ? 'visible' : ''} text-[1.2rem] text-[#e8ddd0] max-w-[700px] mx-auto mt-8 leading-[1.8]`}
          >
            Seja honesto consigo mesmo antes de avançar. Este papel exige perfil específico.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mt-12">
          {dealbreakers.map((item) => (
            <DealBreakerItem key={item} text={item} />
          ))}
        </div>

        <div
          ref={warningRef}
            className={`fade-in ${warningVisible ? 'visible' : ''} text-center mt-16 p-8 bg-black/30 border-[3px] border-(--cream) relative z-10`}
        >
          <p className="font-['Space_Grotesk'] text-[1.4rem] font-bold tracking-[1px]">
            👉 Este é um papel para quem quer construir, não apenas manter.
          </p>
        </div>
      </div>
    </section>
  );
}

