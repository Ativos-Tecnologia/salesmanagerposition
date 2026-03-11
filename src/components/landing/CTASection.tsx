import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export function CTASection() {
  const { elementRef: titleRef, isVisible: titleVisible } =
    useScrollAnimation();
  const { elementRef: quoteRef, isVisible: quoteVisible } =
    useScrollAnimation();

  return (
    <section className="text-center px-8 py-32 relative overflow-hidden bg-linear-to-t to-[#0f21c5] from-[#040E6A] text-(--cream)">
      {' '}
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center justify-center gap-10 ">
        <h2
          ref={titleRef}
          className={`fade-in ${
            titleVisible ? 'visible' : ''
          } font-['Space_Grotesk'] text-2xl lg:text-6xl leading-[1.25] font-black`}
        >
          Construa a Infraestrutura
          <br /> Inteligente da Ativos
        </h2>
        <div className="w-1/3 h-[2px] bg-[#ffffff4b] mx-auto" />
        <p
          ref={quoteRef}
          className={`fade-in ${
            quoteVisible ? 'visible' : ''
          } text-lg lg:text-2xl italic max-w-5xl mx-auto text-[#e8e6dd] leading-[1.7]`}
        >
          Se você já construiu automações, scrapers e integrações que rodam de
          verdade, esse é o lugar certo. Mostre o que já fez e venha construir
          com a gente.
        </p>

        <Link
          to="/application"
          className="inline-block max-w-4xl rounded-2xl px-14 py-5 bg-[#59FF99] text-[#04082D] font-['Space_Grotesk'] text-xs lg:text-2xl font-bold tracking-[2px] uppercase no-underline border-[3px] border-[#B1F9DA] cursor-pointer transition-all duration-400 relative shadow-[0_8px_20px_rgba(89,255,153,0.4)] mt-8 hover:bg-[#B1F9DA] hover:-translate-y-[3px] hover:shadow-[0_12px_30px_rgba(89,255,153,0.6)]"
        >
          Clique aqui para Entender a Missão, Resultados Esperados e
          Competências do Cargo
        </Link>
      </div>
    </section>
  );
}
