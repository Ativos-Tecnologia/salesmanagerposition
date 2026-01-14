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

interface ApplicationDetail {
  id: string;
  full_name: string;
  email: string;
  whatsapp: string;
  cpf: string;
  birth_date: string;
  city: string;
  state: string;
  salary_expectation: string;
  final_notes: string;
  status: string;
  created_at: string;
  step1_mission_reflection: string;
  documents: string[];
  photo_url: string | null;
  social_media: Array<{ name: string; url: string }> | null;
  competencies: Array<{ name: string; rating: string; example: string }>;
  // Outcomes
  outcome21_playbook_comment: string;
  outcome22_team_restructure_comment: string;
  outcome23_operational_discipline_comment: string;
  outcome24_high_performance_comment: string;
  outcome241_bar_raiser_comment: string;
  outcome242_accountability_comment: string;
  outcome26_conversion_comment: string;
  outcome27_ai_comment: string;
}

export function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [application, setApplication] = useState<ApplicationDetail | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
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

        // Carregar URLs dos arquivos
        if (appData.documents && appData.documents.length > 0) {
          const urls = await getFileUrls(appData.documents);
          setFileUrls(urls);
        }

        // Carregar URL da foto
        if (appData.photo_url) {
          const photoUrls = await getFileUrls([appData.photo_url]);
          setPhotoUrl(photoUrls[0]);
        }
      }

      setIsLoading(false);
    }

    if (id) {
      loadApplication();
    }
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

  const competencyLabels: Record<string, string> = {
    comp31: 'Visão Estratégica',
    comp32: 'Execução e Disciplina',
    comp33: 'Liderança de Alta Performance',
    comp34: 'Adaptabilidade e Aprendizado',
    comp35: 'Comunicação e Influência',
    comp36: 'Orientação a Dados',
    comp37: 'Resolução de Problemas',
    comp38: 'Ownership e Responsabilidade',
  };

  const outcomeLabels: Record<string, string> = {
    outcome21: '2.1 Playbook de Vendas',
    outcome22: '2.2 Reestruturação do Time',
    outcome23: '2.3 Disciplina Operacional',
    outcome24: '2.4 Time em Alta Performance',
    outcome241: '2.4.1 Bar Raiser',
    outcome242: '2.4.2 Accountability',
    outcome26: '2.6 Conversão',
    outcome27: '2.7 IA e Eficiência',
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

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status e Ações */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{application.full_name}</CardTitle>
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
              <div className="flex gap-2">
                <Button
                  onClick={() => handleUpdateStatus('approved')}
                  disabled={isUpdating}
                  variant={
                    application.status === 'approved' ? 'default' : 'outline'
                  }
                  size="sm"
                  className={`${
                    application.status === 'approved'
                      ? 'bg-emerald-400 text-white hover:bg-emerald-500'
                      : ''
                  }`}
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
                  className={`${
                    application.status === 'rejected'
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : ''
                  }`}
                >
                  Rejeitar
                </Button>
                <Button
                  onClick={() => handleUpdateStatus('pending')}
                  disabled={isUpdating}
                  variant="outline"
                  size="sm"
                  className={`${
                    application.status === 'pending'
                      ? 'opacity-80 bg-yellow-400 text-black hover:bg-yellow-500'
                      : ''
                  }`}
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
            {/* Dados Pessoais */}
            <Card>
              <CardHeader>
                <CardTitle>Dados Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-600">CPF</p>
                    <p>{application.cpf}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-600">
                      Data de Nascimento
                    </p>
                    <p>{application.birth_date}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-600">
                      Cidade
                    </p>
                    <p>{application.city}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-600">
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
                  <p className="text-sm font-semibold text-slate-600">Email</p>
                  <p>{application.email}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-600">
                    WhatsApp
                  </p>
                  <p>{application.whatsapp}</p>
                </div>
              </CardContent>
            </Card>

            {/* Redes Sociais */}
            {application.social_media &&
              application.social_media.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Redes Sociais</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {application.social_media.map((social, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-slate-50 rounded border"
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900">
                              {social.name}
                            </p>
                            <a
                              href={social.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline break-all"
                            >
                              {social.url}
                            </a>
                          </div>
                          <a
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 text-xl"
                          >
                            🔗
                          </a>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Reflexão sobre a Missão */}
            <Card>
              <CardHeader>
                <CardTitle>Reflexão sobre a Missão</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">
                  {application.step1_mission_reflection}
                </p>
              </CardContent>
            </Card>

            {/* Outcomes */}
            <Card>
              <CardHeader>
                <CardTitle>Comentários sobre Outcomes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries({
                  outcome21: application.outcome21_playbook_comment,
                  outcome22: application.outcome22_team_restructure_comment,
                  outcome23:
                    application.outcome23_operational_discipline_comment,
                  outcome24: application.outcome24_high_performance_comment,
                  outcome241: application.outcome241_bar_raiser_comment,
                  outcome242: application.outcome242_accountability_comment,
                  outcome26: application.outcome26_conversion_comment,
                  outcome27: application.outcome27_ai_comment,
                }).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-sm font-semibold text-slate-600 mb-1">
                      {outcomeLabels[key]}
                    </p>
                    <p className="text-sm whitespace-pre-wrap">{value}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Competências */}
            <Card>
              <CardHeader>
                <CardTitle>Competências Avaliadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {application.competencies?.map((comp, index) => (
                  <div key={index} className="border-l-4 border-slate-300 pl-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold">
                        {competencyLabels[comp.name] || comp.name}
                      </p>
                      <span className="text-sm font-bold text-blue-600">
                        Nota: {comp.rating}/5
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
                  <p className="whitespace-pre-wrap">
                    {application.final_notes}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Coluna Lateral */}
          <div className="space-y-6">
            {/* Ações da Entrevista */}
            <Card>
              <CardHeader>
                <CardTitle>Entrevistas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() =>
                    navigate(`/admin/applications/${id}/screening`)
                  }
                  className="w-full"
                  variant="outline"
                >
                  Triagem Inicial
                </Button>
                <Button
                  onClick={() =>
                    navigate(`/admin/applications/${id}/interview`)
                  }
                  className="w-full"
                  variant="outline"
                >
                  Entrevista Principal
                </Button>
              </CardContent>
            </Card>

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

            {/* Foto do Candidato */}
            {photoUrl && (
              <Card>
                <CardHeader>
                  <CardTitle>Foto do Candidato</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <img
                      src={photoUrl}
                      alt={`Foto de ${application.full_name}`}
                      className="w-full max-h-60 max-w-sm rounded-lg shadow-md object-contain"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Documentos */}
            {application.documents && application.documents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Documentos Anexados</CardTitle>
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
                          className="block p-3 line-clamp-2  bg-slate-50 hover:bg-slate-100 rounded border text-sm transition-colors"
                          onClick={e => {
                            if (fileUrl === '#') {
                              e.preventDefault();
                              alert('Carregando URL do arquivo...');
                            }
                          }}
                        >
                          📎 {fileName}
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
