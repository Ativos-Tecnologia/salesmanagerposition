import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { DecorativeLine } from './DecorativeLine';

export function CTASection() {
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { elementRef: quoteRef, isVisible: quoteVisible } = useScrollAnimation();

  return (
    <section className="text-center px-8 py-32 relative overflow-hidden bg-(--navy-deep) text-(--cream)">
      {/* Animated Background Circles */}
      <div
        className="absolute -top-[100px] -left-[100px] w-[300px] h-[300px]"
        style={{
          background: 'radial-gradient(circle, rgba(139, 58, 58, 0.3) 0%, transparent 70%)',
          animation: 'pulse 8s ease-in-out infinite',
        }}
      />
      <div
        className="absolute -bottom-[100px] -right-[100px] w-[300px] h-[300px]"
        style={{
          background: 'radial-gradient(circle, rgba(139, 58, 58, 0.3) 0%, transparent 70%)',
          animation: 'pulse 8s ease-in-out infinite 4s',
        }}
      />

      <div className="max-w-[1100px] mx-auto relative z-10">
        <h2
          ref={titleRef}
          className={`fade-in ${titleVisible ? 'visible' : ''} font-['Space_Grotesk'] text-[clamp(2.2rem,5vw,4rem)] mb-8 leading-[1.25] font-black`}
        >
          Orquestre o Futuro: Venha Fazer<br />o Melhor Trabalho da Sua Vida na<br />Revolução de Vendas 2.0 do Mercado<br />de Precatórios
        </h2>

        <DecorativeLine className="fade-in visible" />

        <p
          ref={quoteRef}
          className={`fade-in ${quoteVisible ? 'visible' : ''} text-[1.4rem] italic mb-12 max-w-[800px] mx-auto text-[#e8e6dd] leading-[1.7]`}
        >
          Construa a máquina, lidere a execução e veja o seu impacto. Procure seu próximo caso 
          de sucesso estruturando a operação comercial de elite de uma potência em plena escala.
        </p>

        <a
          href="#"
          className="inline-block px-14 py-5 bg-(--burgundy) text-(--cream) font-['Space_Grotesk'] text-[1.1rem] font-bold tracking-[2px] uppercase no-underline border-[3px] border-(--cream) cursor-pointer transition-all duration-400 relative shadow-[0_8px_20px_rgba(0,0,0,0.3)] mt-8 hover:bg-[#a04545] hover:-translate-y-[3px] hover:shadow-[0_12px_30px_rgba(139,58,58,0.5)]"
        >
          Entender Missão, Resultados Esperados e Competências do Cargo
        </a>
      </div>
    </section>
  );
}

