import { useScrollAnimation } from "../../hooks/useScrollAnimation";

const challenges = [
  {
    title: "Motor de Receita & GTM",
    description:
      "Arquitetar a estratégia Go-To-Market de ponta a ponta: posicionamento, funil, canais e atribuição. Marketing como coproprietário da meta de receita — ao lado de Vendas, não atrás dela.",
  },
  {
    title: "Métricas de Negócio, Não de Vaidade",
    description:
      "CAC, LTV, ROI, Pipeline Gerado e Receita Atribuída. Você será avaliado por impacto real no negócio — não por curtidas, alcance ou prêmios de criatividade.",
  },
  {
    title: "Operação AI-First",
    description:
      "IA usada para acelerar execução, escalar processos e amplificar a criatividade do time. Você lidera uma estrutura MarTech-Savvy, com dados unificados e personalização em tempo real.",
  },
  {
    title: "Parceria CMO–CTO",
    description:
      "Derrubar silos com Tecnologia, Produto, Vendas e Finanças. Marketing, dados e tech operando como uma única engrenagem — não três times negociando integração.",
  },
];

function ChallengeItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <div
      ref={elementRef}
      className={`fade-in ${
        isVisible ? "visible" : ""
      } p-10 bg-white border rounded-2xl border-(--navy-deep) border-l-4 border-l-[#0237E4] shadow-[8px_8px_0_rgba(0,30,98,0.1)] transition-all duration-400 relative hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0_rgba(0,30,98,0.15)]`}
    >
      <h3 className="font-['Space_Grotesk'] text-2xl mb-4 text-(--navy-deep) font-bold ">
        {title}
      </h3>
      <p className="text-(--text-faded) text-lg">{description}</p>
    </div>
  );
}

export function ChallengeSection() {
  const { elementRef: titleRef, isVisible: titleVisible } =
    useScrollAnimation();
  const { elementRef: subtitleRef, isVisible: subtitleVisible } =
    useScrollAnimation();

  return (
    <section className="py-24 relative bg-(--off-white) ">
      <div className="max-w-7xl mx-auto px-8 flex flex-col items-center justify-center gap-10">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <h2
            ref={titleRef}
            className={`fade-in ${
              titleVisible ? "visible" : ""
            } font-['Space_Grotesk'] text-2xl lg:text-4xl font-black text-(--navy-deep) `}
          >
            Do Que Você Será Dono
          </h2>

          <p
            ref={subtitleRef}
            className={`fade-in ${
              subtitleVisible ? "visible" : ""
            } text-lg lg:text-2xl text-[#515151] max-w-5xl mx-auto  leading-[1.8]`}
          >
            A Ativos cresceu e precisa de um motor de crescimento de verdade.
            Quatro frentes de domínio direto — com métrica, orçamento e voz na
            estratégia.
          </p>
          <div className="w-1/3 h-[2px] bg-[#000000] mx-auto" />
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
