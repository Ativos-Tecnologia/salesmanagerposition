import { Link } from 'react-router-dom';

export function SuccessScreen() {
  return (
    <div className="text-center  px-6 opacity-0 animate-[fadeInUp_0.8s_ease_forwards]">
      {/* Ícone de Sucesso com animação */}
      <div className="relative inline-block mb-8">
        <div className="relative text-[80px] text-[#00e676] animate-[fadeInUp_0.5s_ease_forwards]">
          ✓
        </div>
      </div>

      {/* Título */}
      <h2 className="text-4xl md:text-4xl font-extrabold text-[#0a0e27] mb-4 font-['Space_Grotesk']">
        Aplicação Enviada com Sucesso!
      </h2>

      {/* Linha decorativa */}
      <div className="w-24 h-1 bg-[#00e676] mx-auto mb-6"></div>

      {/* Mensagem principal */}
      <p className="text-xl text-[#546e7a] max-w-[600px] mx-auto mb-8 leading-relaxed font-['Space_Grotesk']">
        Obrigado por dedicar seu tempo e reflexão a este processo.
        <br />
        A equipe da Ativos analisará sua candidatura e retornará em breve.
      </p>

      {/* Card informativo */}


      {/* Botão de retorno */}
      <Link
        to="/"
        className="inline-block px-8 py-3 bg-[#0a0e27] text-white rounded font-['Space_Grotesk'] text-sm font-semibold tracking-wider uppercase transition-all hover:bg-[#1a1e37] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(10,14,39,0.3)]"
      >
        Voltar para Home
      </Link>

    </div>
  );
}

