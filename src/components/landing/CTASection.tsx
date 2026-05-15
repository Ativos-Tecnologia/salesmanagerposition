import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

export function CTASection() {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { elementRef: titleRef, isVisible: titleVisible } =
    useScrollAnimation();
  const { elementRef: quoteRef, isVisible: quoteVisible } =
    useScrollAnimation();

  function handleProceed() {
    setIsDialogOpen(false);
    navigate("/application");
  }

  return (
    <section className="text-center px-8 py-32 relative overflow-hidden bg-linear-to-t to-[#0f21c5] from-[#040E6A] text-(--cream)">
      {" "}
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center justify-center gap-10 ">
        <h2
          ref={titleRef}
          className={`fade-in ${
            titleVisible ? "visible" : ""
          } font-['Space_Grotesk'] text-2xl lg:text-6xl leading-[1.25] font-black`}
        >
          Construa o Motor de
          <br /> Crescimento da Ativos
        </h2>
        <div className="w-1/3 h-[2px] bg-[#ffffff4b] mx-auto" />
        <p
          ref={quoteRef}
          className={`fade-in ${
            quoteVisible ? "visible" : ""
          } text-lg lg:text-2xl italic max-w-5xl mx-auto text-[#e8e6dd] leading-[1.7]`}
        >
          Se você já executou GTMs que moveram a agulha da receita e se você
          entende de métricas do mundo digital esse é o lugar certo. Mostre seu
          track record e venha construir o próximo capítulo com a gente.
        </p>

        <button
          type="button"
          onClick={() => setIsDialogOpen(true)}
          className="inline-block max-w-4xl rounded-2xl px-14 py-5 bg-[#59FF99] text-[#04082D] font-['Space_Grotesk'] text-xs lg:text-2xl font-bold tracking-[2px] uppercase border-[3px] border-[#B1F9DA] cursor-pointer transition-all duration-400 relative shadow-[0_8px_20px_rgba(89,255,153,0.4)] mt-8 hover:bg-[#B1F9DA] hover:-translate-y-[3px] hover:shadow-[0_12px_30px_rgba(89,255,153,0.6)]"
        >
          Clique aqui para Entender a Missão, Resultados Esperados e
          Competências do Cargo
        </button>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          overlayClassName="bg-[#04082D]/78 backdrop-blur-md backdrop-saturate-150"
          className="max-h-[min(90dvh,640px)] gap-0 overflow-hidden overflow-y-auto rounded-[1.75rem] border-0 bg-transparent p-0 shadow-[0_32px_120px_-24px_rgba(4,14,106,0.65),0_0_0_1px_rgba(255,255,255,0.06)_inset] sm:max-w-[min(92vw,440px)] [&>button]:right-4 [&>button]:top-4 [&>button]:z-30 [&>button]:flex [&>button]:h-11 [&>button]:w-11 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:border [&>button]:border-white/25 [&>button]:bg-[#040E6A]/35 [&>button]:text-white [&>button]:opacity-100 [&>button]:shadow-lg [&>button]:backdrop-blur-md [&>button]:transition-all [&>button]:duration-300 [&>button]:hover:scale-105 [&>button]:hover:bg-[#040E6A]/55 [&>button]:hover:shadow-xl"
        >
          <div className="relative bg-[#f5f3ed] font-['Space_Grotesk'] text-[#1a1a1a]">
            <div className="relative overflow-hidden bg-linear-to-br from-[#040E6A] via-[#0f21c5] to-[#2247e8] px-6 pt-6 pb-14">
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.12]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
              <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#59FF99]/25 blur-[56px]" />
              <div className="pointer-events-none absolute -bottom-12 left-0 h-36 w-36 rounded-full bg-[#6b8cff]/30 blur-[48px]" />
              <div className="pointer-events-none absolute bottom-0 right-1/4 h-24 w-24 rounded-full bg-white/15 blur-3xl" />

              <div className="relative z-10 flex flex-col items-center gap-2.5">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#B1F9DA] backdrop-blur-sm">
                  <Sparkles className="size-3 text-[#59FF99]" aria-hidden />
                  Presencial
                </span>
                <p className="text-center text-[2rem] font-black leading-none tracking-tight text-white md:text-[2.25rem]">
                  Recife
                  <span className="text-[#59FF99]">.</span>
                </p>
                <p className="text-center text-[11px] font-medium uppercase tracking-[0.18em] text-white/65">
                  Pernambuco · Brasil
                </p>
              </div>
            </div>

            <div className="relative z-20 -mt-10 flex justify-center">
              <div className="relative">
                <span className="absolute inset-0 rounded-2xl bg-[#59FF99]/35 opacity-40" />
                <div className="relative flex size-17 items-center justify-center rounded-2xl border-[3px] border-[#59FF99] bg-[#f5f3ed] shadow-[0_14px_44px_rgba(4,14,106,0.22)] ring-[5px] ring-[#f5f3ed]">
                  <MapPin
                    className="size-8 text-[#040E6A]"
                    strokeWidth={2.25}
                    aria-hidden
                  />
                </div>
              </div>
            </div>

            <DialogHeader className="space-y-0 px-8 pb-1 pt-8 text-center sm:text-center">
              <DialogTitle className="sr-only">
                Atenção — vaga presencial em Recife, Pernambuco
              </DialogTitle>
              <p className="font-['Space_Grotesk'] text-lg font-bold leading-snug text-[#04082D]">
                Antes de seguir
              </p>
              <DialogDescription asChild>
                <p className="mt-3 text-pretty text-[15px] leading-[1.65] text-[#4a4a4a] sm:text-[16px]">
                  Atenção, a vaga é{" "}
                  <span className="font-semibold text-[#040E6A]">
                    presencial no Município do Recife/PE
                  </span>
                  . Caso queira continuar com o preenchimento do formulário, use
                  o botão abaixo.
                </p>
              </DialogDescription>
            </DialogHeader>

            <div className="mx-8 my-5">
              <div className="h-px w-full bg-linear-to-r from-transparent via-[#040E6A]/18 to-transparent" />
            </div>

            <DialogFooter className="flex-col gap-4 px-8 pb-8 pt-0 sm:flex-col sm:space-x-0">
              <Button
                type="button"
                onClick={handleProceed}
                className="group relative h-auto w-full overflow-hidden rounded-2xl border-[3px] border-[#B1F9DA] bg-[#59FF99] py-6 text-[#04082D] shadow-[0_10px_36px_rgba(89,255,153,0.42)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#59FF99] hover:bg-[#7dffb3] hover:shadow-[0_16px_48px_rgba(89,255,153,0.5)]"
              >
                <span className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-white/25 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="relative flex items-center justify-center gap-2 font-['Space_Grotesk'] text-sm font-bold uppercase tracking-[0.2em]">
                  Prosseguir
                  <ArrowRight
                    className="size-5 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden
                  />
                </span>
              </Button>
              <p className="text-center text-xs leading-relaxed text-[#6b6b6b]">
                Pode fechar esta janela se a localização não fizer sentido para
                você.
              </p>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
