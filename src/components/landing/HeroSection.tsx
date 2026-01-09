import ParticlesComponent from "./particles-bg";


export function HeroSection() {
  return (
    <section className="min-h-screen px-4 md:px-8 relative overflow-hidden">
      {/* Particles Background */}
      <ParticlesComponent />

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 items-center justify-between max-w-[1400px] mx-auto min-h-screen py-8 lg:py-0 relative z-10 pointer-events-none">
        <div className="flex flex-col gap-8 lg:gap-20 items-center lg:items-start justify-center w-full mx-auto">
          <div className="z-10">
            <img
              src="/ativos-full.svg"
              alt="Ativos"
              width={200}
              height={200}
              className="w-32  lg:w-[150px] 2xl:w-[250px] h-auto"
            />
          </div>
          <div className="max-w-7xl flex flex-col items-center lg:items-start justify-center gap-6 z-10">
            <div
              className="px-4 py-2 rounded-full text-(--cream) font-['Space_Grotesk'] text-sm font-thin border border-(--cream)"
              style={{ animation: 'fadeInDown 1s ease-out' }}
            >
              Oportunidade Estratégica
            </div>

            <h1
              className="font-['Space_Grotesk'] text-2xl lg:text-6xl leading-[1.15] text-(--cream) font-black text-center lg:text-left"
              style={{ animation: 'fadeInUp 1s ease-out 0.2s both' }}
            >
              Seja o mais novo Líder de <br />
              Operações Comerciais no <br />
              mercado de precatório
            </h1>

            <p
              className="text-base lg:text-lg text-[#e8e6dd] max-w-[850px] mx-auto leading-[1.7] text-center lg:text-left"
              style={{ animation: 'fadeInUp 1s ease-out 0.4s both' }}
            >
              Um mercado bilionário, pouco profissionalizado e em plena
              transformação digital. A Ativos lidera essa mudança — e você pode
              construir a operação de Inbound & Outbound que vai escalar junto
              com o setor. Esta é sua oportunidade de estar no lado certo dessa
              revolução.
            </p>
          </div>
        </div>
        <div className="w-full lg:w-auto flex justify-center lg:justify-end">
          <div className="w-full max-w-85 md:max-w-100 lg:w-[320px] xl:w-90 2xl:w-112.5">
            <div className="relative w-full aspect-9/16">
              <video
                className="absolute top-0 left-0 w-full h-full rounded-2xl z-10 pointer-events-auto"
                src="/video-apresentacao-landing.mp4"
                autoPlay
                loop
                muted
                controls
                playsInline
              ></video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
