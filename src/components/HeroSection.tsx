export function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col gap-20 items-center justify-center px-8 py-12 relative overflow-hidden bg-linear-to-br from-[#041293] to-[#040E72]">
<div>
          <img src="/ativos-full.svg" alt="Ativos" width={150} height={150} />
        </div>

      <div className="max-w-7xl flex flex-col items-center justify-center gap-6">
      

        <div 
          className=" px-4 py-2 rounded-full text-(--cream) font-['Space_Grotesk'] text-sm font-thin border border-(--cream)"
          style={{ animation: 'fadeInDown 1s ease-out' }}
        >
          Oportunidade Estratégica
        </div>

      
        <h1 
          className="font-['Space_Grotesk'] text-7xl leading-[1.15] text-(--cream) mb-7 font-black text-center"
          style={{ animation: 'fadeInUp 1s ease-out 0.2s both' }}
        >
          Seja o mais novo Líder de <br />Operações Comerciais no <br />mercado de precatório
        </h1>

        <p 
          className="text-lg text-[#e8e6dd] mb-12 max-w-[850px] mx-auto leading-[1.7] text-center"
          style={{ animation: 'fadeInUp 1s ease-out 0.4s both' }}
        >
          Um mercado bilionário, pouco profissionalizado e em plena transformação digital. 
          A Ativos lidera essa mudança — e você pode construir a operação de Inbound & Outbound 
          que vai escalar junto com o setor. Esta é sua oportunidade de estar no lado certo dessa revolução.
        </p>
      </div>
    </section>
  );
}

