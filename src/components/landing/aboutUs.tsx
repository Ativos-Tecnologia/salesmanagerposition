import {
  ArrowUpRight,
  Instagram,
  Linkedin,
  Youtube,
} from 'lucide-react';
import { NewsGallery } from './news-gallery';
import { Button } from '../ui/button';

export function AboutUs() {
  const demoData = {
    heading: 'Matérias na mídia',
    items: [
      {
        id: 'item-1',
        title: 'Folha de Pernambuco',
        summary:
          'Nova plataforma promete agilizar acesso a informações sobre precatórios.',
        url: 'https://www.folhape.com.br/economia/nova-plataforma-promete-agilizar-acesso-a-informacoes-sobre/438291/',
        image: '/news-images/folha_de_pernambuco.webp',
      },
      {
        id: 'item-3',
        title: 'JC PE',
        summary:
          'Plataforma gratuita, criada por empresa recifense, ajuda credores a acompanhar precatórios no Brasil.',
        url: 'https://jc.uol.com.br/economia/2025/09/16/plataforma-gratuita-criada-por-empresa-recifense-ajuda-credores-a-acompanhar-precatorios-no-brasil.html',
        image: '/news-images/jcpe.webp',
      },
      {
        id: 'item-4',
        title: 'Movimento Econômico',
        summary:
          'Startup pernambucana cria solução gratuita para credores de precatórios',
        url: 'https://movimentoeconomico.com.br/tecnologia/2025/09/16/startup-pernambucana-cria-solucao-gratuita-para-credores-de-precatorios/',
        image: '/news-images/movimento_economico.webp',
      },
      {
        id: 'item-5',
        title: 'Folha de Pernambuco',
        summary:
          'PEC 66 ativa negócios no mercado de antecipação de precatórios',
        url: 'https://www.folhape.com.br/economia/movimento-economico/pec-66-ativa-negocios-no-mercado-de-antecipacao-de-precatorios/425049/',
        image: '/news-images/pec-66-folha-de-pernambuco.webp',
      },
      {
        id: 'item-6',
        title: 'Movimento Econômico',
        summary:
          'Nova regra de precatórios antecipa prazos e adia pagamentos',
        url: 'https://movimentoeconomico.com.br/economia/2025/07/19/nova-regra-dos-precatorios-antecipa-prazos-e-adia-pagamentos/',
        image: '/news-images/pec-66-movimento-economico.webp',
      },
      {
        id: 'item-7',
        title: 'Diario de pernambuco',
        summary:
          'Nova plataforma gratuita deve facilitar informações sobre precatórios',
        url: 'https://www.diariodepernambuco.com.br/economia/2025/09/11696275-nova-plataforma-gratuita-deve-facilitar-informacoes-sobre-precatorios.html',
        image: '/news-images/seu-precatorio-360-diario-de-pe.webp',
      }
    ],
  };

  return (
    <section className="py-12 md:py-16 lg:py-24 relative mx-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col items-center justify-center gap-8 md:gap-10">
        <div className="flex flex-col items-center justify-center gap-4 md:gap-6 text-center">
          <h2
            className={`font-['Space_Grotesk'] text-2xl sm:text-3xl md:text-4xl font-black text-(--navy-deep) `}
          >
            Sobre a Ativos
          </h2>

          <div className="w-2/3 sm:w-1/2 md:w-1/3 h-[2px] bg-[#000000] mx-auto" />
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-10 w-full">
          <iframe
            className="w-full rounded-2xl shadow-[8px_8px_0_rgba(0,30,98,0.1)] transition-all duration-400 relative hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0_rgba(0,30,98,0.15)]"
            width="640"
            height="400"
            src="https://www.youtube.com/embed/fCbb_WrscYg?si=OjT7T-dtxB3G2v8n"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
          <div className="flex flex-col items-start justify-center gap-6 md:gap-8 lg:gap-10 w-full lg:max-w-lg">
            <h3 className="text-base sm:text-lg md:text-xl font-thin text-(--navy-deep)">
              Somos uma empresa em rápida expansão, focada em inovação e no
              desenvolvimento de novas tecnologias para o mercado de
              precatórios.
            </h3>
            <h3 className="text-base sm:text-lg md:text-xl font-thin text-(--navy-deep)">
              O SeuPrecatório360 é um dos produtos que visam agilizar o acesso a
              informações sobre precatórios, facilitando a vida de credores,
              investidores e stakeholders do mercado de precatórios.
            </h3>
            <div className="flex flex-wrap sm:flex-nowrap justify-start items-start gap-4 sm:gap-6 w-full">
              <a href="https://www.linkedin.com/company/ativosprecatorios/posts/?feedView=all" target="_blank">
              <div className="bg-blue-400 p-2 rounded-full hover:bg-blue-500 transition-all duration-400 cursor-pointer hover:scale-105">
                <Linkedin className="text-white" size={24} />

                </div>
              </a>
              <a href="https://www.instagram.com/ativosprecatorios/" target="_blank">
                <div className="bg-linear-to-bl from-orange-400 to-purple-600 p-2 rounded-full hover:bg-blue-500 transition-all duration-400 cursor-pointer hover:scale-105">
                  <Instagram className="text-white" size={24} />
                </div>
              </a>
              <a href="https://www.youtube.com/@ativosprecatorios" target="_blank">
                <div className="bg-red-500 p-2 rounded-full hover:bg-blue-500 transition-all duration-400 cursor-pointer hover:scale-105">
                  <Youtube className="text-white" size={24} />
                </div>
              </a>
              <a
                href="https://www.ativos.com/"
                target="_blank"
                className="w-full sm:flex-1 group"
              >
                <Button className="w-full flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-500 transition-all duration-400 cursor-pointer text-base sm:text-lg">
                  Ativos.com
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:translate-y-[-2px]" />
                </Button>
              </a>
            </div>
          </div>
        </div>
        <NewsGallery {...demoData} />
      </div>
    </section>
  );
}
