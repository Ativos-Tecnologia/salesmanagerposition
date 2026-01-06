import { useScrollAnimation } from '../hooks/useScrollAnimation';


const challenges = [
  {
    title: 'Liderar Equipes de Alta Performance',
    description: 'Comandar times inbound e outbound, desenvolvendo talentos e construindo uma cultura de execução orientada por resultado.',
  },
  {
    title: 'Construir o Playbook Comercial do Zero',
    description: 'Criar o manual que define como vendemos nos canais diretos. Scripts, cadências, processos — tudo estruturado desde a fundação.',
  },
  {
    title: 'Transformar Leads em Aquisições de Precatórios',
    description: 'Trabalhe lado a lado com a nossa equipe de marketing para conduzir as negociações diretas com credores de precatórios.',
  },
  {
    title: 'Criar um Novo Pilar Estratégico',
    description: 'Não é sobre fechar operação. É sobre construir uma nova frente de crescimento dentro da empresa que mais cresce no setor.',
  },
];

function ChallengeItem({ title, description }: { title: string; description: string }) {
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <div
      ref={elementRef}
      className={`fade-in ${isVisible ? 'visible' : ''} p-10 bg-white border rounded-2xl border-(--navy-deep) border-l-4 border-l-[#0237E4] shadow-[8px_8px_0_rgba(0,30,98,0.1)] transition-all duration-400 relative hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0_rgba(0,30,98,0.15)]`}
    >
      <h3 className="font-['Space_Grotesk'] text-2xl mb-4 text-(--navy-deep) font-bold ">
        {title}
      </h3>
      <p className="text-(--text-faded) text-lg">{description}</p>
    </div>
  );
}

export function ChallengeSection() {
  const { elementRef: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { elementRef: subtitleRef, isVisible: subtitleVisible } = useScrollAnimation();

  return (
    <section className="py-24 relative bg-(--off-white) ">
      <div className="max-w-7xl mx-auto px-8 flex flex-col items-center justify-center gap-10">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <h2
            ref={titleRef}
            className={`fade-in ${titleVisible ? 'visible' : ''} font-['Space_Grotesk'] text-4xl font-black text-(--navy-deep) `}
          >
            Desbrave o Novo Setor de Vendas Diretas da Ativos
          </h2>
        
          <p
            ref={subtitleRef}
            className={`fade-in ${subtitleVisible ? 'visible' : ''} text-2xl text-[#515151] max-w-5xl mx-auto  leading-[1.8]`}
          >
            A Ativos se consolidou no mercado de precatórios por meio de intermediários. 
            Agora, buscamos quem lidere a construção de Inbound & Outbound.
          </p>
          <div className='w-1/3 h-[2px] bg-[#000000] mx-auto'/>
        </div>
      
        <div className="grid gap-10 max-w-4xl">
          {challenges.map((challenge) => (
            <ChallengeItem key={challenge.title} {...challenge} />
          ))}
        </div>
      </div>
    </section>
  );
}

