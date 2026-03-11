import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  getApplicationById,
  updateApplicationStatus,
  getFileUrls,
} from '../service/api';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';

interface OutcomeItem {
  accepted: boolean;
  comment: string;
}

interface CompetencyItem {
  name: string;
  rating: string;
  example: string;
}

interface ApplicationDetail {
  id: string;
  full_name: string;
  email: string;
  whatsapp: string;
  cpf: string;
  birth_date: string;
  city: string;
  state: string;
  github_link: string | null;
  salary_expectation: string;
  availability: string;
  final_notes: string | null;
  mission_motivation: string;
  status: string;
  created_at: string;
  documents: string[];
  outcomes: OutcomeItem[];
  competencies: CompetencyItem[];
}

const outcomeLabels = [
  'Automações em Produção',
  'Coleta de Dados Confiável',
  'IA Integrada a um Processo Real',
  'Manter o que Construiu',
];

const competencyLabels: Record<string, string> = {
  comp1: 'Dono do que Constrói',
  comp2: 'Autonomia + Comunicação',
  comp3: 'Resolve Problema de Verdade',
  comp4: 'Aprende Rápido',
};

const availabilityLabels: Record<string, string> = {
  imediata: 'Imediata',
  '15dias': '15 dias',
  '30dias': '30 dias',
  outro: 'Outro',
};

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
  approved: { label: 'Aprovado', color: 'bg-emerald-100 text-emerald-800' },
  rejected: { label: 'Rejeitado', color: 'bg-red-100 text-red-800' },
};

export function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [application, setApplication] = useState<ApplicationDetail | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadApplication() {
      if (!id) return;

      setIsLoading(true);
      const result = await getApplicationById(id);

      if (result.success && result.data) {
        const appData = result.data as ApplicationDetail;
        setApplication(appData);

        if (appData.documents && appData.documents.length > 0) {
          const urls = await getFileUrls(appData.documents);
          setFileUrls(urls);
        }
      }

      setIsLoading(false);
    }

    if (id) loadApplication();
  }, [id]);

  async function handleUpdateStatus(newStatus: string) {
    if (!id) return;
    setIsUpdating(true);
    const result = await updateApplicationStatus(id, newStatus);
    if (result.success) {
      setApplication(prev => (prev ? { ...prev, status: newStatus } : null));
    }
    setIsUpdating(false);
  }

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Candidatura não encontrada</p>
      </div>
    );
  }

  const status = statusConfig[application.status] ?? {
    label: application.status,
    color: 'bg-slate-100 text-slate-800',
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/applications')}
                className="text-sm hover:underline"
              >
                ← Voltar para lista
              </button>
              <h1 className="text-xl font-bold">Detalhes da Candidatura</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">{user?.email}</span>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                Sair
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status e Ações */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <CardTitle>{application.full_name}</CardTitle>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${status.color}`}
                  >
                    {status.label}
                  </span>
                </div>
                <CardDescription>
                  Candidatura recebida em{' '}
                  {new Date(application.created_at).toLocaleDateString(
                    'pt-BR',
                    {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    }
                  )}
                </CardDescription>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={() => handleUpdateStatus('approved')}
                  disabled={isUpdating}
                  variant={
                    application.status === 'approved' ? 'default' : 'outline'
                  }
                  size="sm"
                  className={
                    application.status === 'approved'
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                      : ''
                  }
                >
                  Aprovar
                </Button>

                <Button
                  onClick={() => handleUpdateStatus('rejected')}
                  disabled={isUpdating}
                  variant={
                    application.status === 'rejected'
                      ? 'destructive'
                      : 'outline'
                  }
                  size="sm"
                  className={
                    application.status === 'rejected'
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : ''
                  }
                >
                  Rejeitar
                </Button>
                <Button
                  onClick={() => handleUpdateStatus('pending')}
                  disabled={isUpdating}
                  variant="outline"
                  size="sm"
                  className={
                    application.status === 'pending'
                      ? 'bg-yellow-400 text-black hover:bg-yellow-500'
                      : ''
                  }
                >
                  Pendente
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Motivação */}
            <Card>
              <CardHeader>
                <CardTitle>Motivação para a Vaga</CardTitle>
                <CardDescription>
                  Por que essa vaga faz sentido pra você agora?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-slate-700">
                  {application.mission_motivation}
                </p>
              </CardContent>
            </Card>

            {/* Dados Pessoais */}
            <Card>
              <CardHeader>
                <CardTitle>Dados Pessoais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">CPF</p>
                    <p>{application.cpf}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      Data de Nascimento
                    </p>
                    <p>{application.birth_date}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      Cidade
                    </p>
                    <p>{application.city}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      Estado
                    </p>
                    <p>{application.state}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contato */}
            <Card>
              <CardHeader>
                <CardTitle>Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-slate-500">E-mail</p>
                  <p>{application.email}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    WhatsApp
                  </p>
                  <p>{application.whatsapp}</p>
                </div>
                {application.github_link && (
                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      GitHub / Portfólio
                    </p>
                    <a
                      href={application.github_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      {application.github_link}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Outcomes */}
            <Card>
              <CardHeader>
                <CardTitle>Resultados Esperados</CardTitle>
                <CardDescription>
                  Experiência prévia com cada resultado
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {(application.outcomes ?? []).map((outcome, index) => (
                  <div key={index} className="border-l-4 border-blue-300 pl-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                          outcome.accepted
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {outcome.accepted ? '✓' : '✗'}
                      </span>
                      <p className="font-semibold text-slate-800">
                        {outcomeLabels[index] ?? `Resultado ${index + 1}`}
                      </p>
                    </div>
                    {index === 3 ? (
                      <p
                        className={`text-sm font-semibold ${
                          outcome.accepted ? 'text-emerald-600' : 'text-red-600'
                        }`}
                      >
                        {outcome.accepted
                          ? 'Sim, confirma o compromisso'
                          : 'Não confirmou'}
                      </p>
                    ) : outcome.comment ? (
                      <p className="text-sm whitespace-pre-wrap text-slate-600">
                        {outcome.comment}
                      </p>
                    ) : (
                      <p className="text-sm text-slate-400 italic">
                        Sem comentário
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Competências */}
            <Card>
              <CardHeader>
                <CardTitle>Competências Avaliadas</CardTitle>
                <CardDescription>Autoavaliação + exemplo real</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {(application.competencies ?? []).map((comp, index) => (
                  <div key={index} className="border-l-4 border-slate-300 pl-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold text-slate-800">
                        {competencyLabels[comp.name] ?? comp.name}
                      </p>
                      <span className="text-sm font-bold text-blue-600 whitespace-nowrap ml-2">
                        {comp.rating}/5
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap text-slate-600">
                      {comp.example}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Notas Finais */}
            {application.final_notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Informações Adicionais</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-slate-700">
                    {application.final_notes}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Coluna Lateral */}
          <div className="space-y-6">
            {/* Pretensão Salarial */}
            <Card>
              <CardHeader>
                <CardTitle>Pretensão Salarial</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  {application.salary_expectation}
                </p>
              </CardContent>
            </Card>

            {/* Disponibilidade */}
            <Card>
              <CardHeader>
                <CardTitle>Disponibilidade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-slate-700">
                  {availabilityLabels[application.availability] ??
                    application.availability}
                </p>
              </CardContent>
            </Card>

            {/* Documentos */}
            {application.documents && application.documents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Arquivos Anexados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {application.documents.map((doc, index) => {
                      const fileName = doc.split('/').pop() || doc;
                      const fileUrl = fileUrls[index] || '#';

                      return (
                        <a
                          key={index}
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 rounded border text-sm transition-colors"
                          onClick={e => {
                            if (fileUrl === '#') {
                              e.preventDefault();
                              alert('Carregando URL do arquivo...');
                            }
                          }}
                        >
                          📎{' '}
                          <span className="break-all line-clamp-2">
                            {fileName}
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
