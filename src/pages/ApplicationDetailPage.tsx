import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  getApplicationById,
  updateApplicationStatus,
  updateApplicationRejectionObservation,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';

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
  salary_expectation: string;
  final_notes: string | null;
  mission_motivation: string;
  mission_accepted: boolean;
  status: string;
  rejection_observation: string | null;
  created_at: string;
  documents: string[];
  outcomes: OutcomeItem[];
  competencies: CompetencyItem[];
}

const outcomeLabels = [
  'Diagnóstico e Estratégia GTM',
  'Reestruturação para Equipe Whole-Brained',
  'Alinhamento Interfuncional (Fim dos Silos)',
  'Entrega de Métricas Financeiras e de Crescimento',
  'Adoção de IA e Eficiência MarTech',
];

const competencyLabels: Record<string, string> = {
  comp1: 'Ownership Radical e Accountability',
  comp2: 'Fluência Financeira (Rigor Analítico)',
  comp3: 'Mentalidade Test-and-Learn (Agilidade)',
  comp4: 'Colaboração e Liderança de Integração',
  comp5: 'Liderança Transformadora de Pessoas',
  comp6: 'Proficiência Técnica e Inovação (AI-First)',
  comp7: 'Foco Obsessivo no Cliente',
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
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectObservationDraft, setRejectObservationDraft] = useState('');
  const [rejectModalError, setRejectModalError] = useState<string | null>(null);
  const [rejectionEditing, setRejectionEditing] = useState(false);
  const [rejectionEditDraft, setRejectionEditDraft] = useState('');
  const [isSavingRejectionNote, setIsSavingRejectionNote] = useState(false);
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
        setApplication({
          ...appData,
          rejection_observation: appData.rejection_observation ?? null,
        });

        if (appData.documents && appData.documents.length > 0) {
          const urls = await getFileUrls(appData.documents, appData.id);
          setFileUrls(urls);
        }
      }

      setIsLoading(false);
    }

    if (id) loadApplication();
  }, [id]);

  function openRejectDialog() {
    setRejectObservationDraft('');
    setRejectModalError(null);
    setRejectDialogOpen(true);
  }

  async function handleConfirmReject() {
    if (!id) return;
    const trimmed = rejectObservationDraft.trim();
    if (!trimmed) {
      setRejectModalError('Descreva o motivo da rejeição antes de confirmar.');
      return;
    }
    setRejectModalError(null);
    setIsUpdating(true);
    const result = await updateApplicationStatus(id, 'rejected', trimmed);
    if (result.success && result.data) {
      const row = result.data as ApplicationDetail;
      setApplication(prev =>
        prev
          ? {
              ...prev,
              status: row.status ?? 'rejected',
              rejection_observation:
                row.rejection_observation ?? trimmed ?? null,
            }
          : null
      );
      setRejectDialogOpen(false);
      setRejectObservationDraft('');
    }
    setIsUpdating(false);
  }

  async function handleUpdateStatus(newStatus: string) {
    if (!id) return;
    setIsUpdating(true);
    const result = await updateApplicationStatus(id, newStatus);
    if (result.success && result.data) {
      const row = result.data as ApplicationDetail;
      setApplication(prev =>
        prev
          ? {
              ...prev,
              status: row.status ?? newStatus,
              rejection_observation:
                newStatus === 'rejected'
                  ? (row.rejection_observation ?? prev.rejection_observation)
                  : null,
            }
          : null
      );
    } else if (result.success) {
      setApplication(prev =>
        prev
          ? {
              ...prev,
              status: newStatus,
              rejection_observation: newStatus === 'rejected' ? prev.rejection_observation : null,
            }
          : null
      );
    }
    setIsUpdating(false);
  }

  function startEditingRejectionNote() {
    setRejectionEditDraft(application?.rejection_observation ?? '');
    setRejectionEditing(true);
  }

  function cancelEditingRejectionNote() {
    setRejectionEditing(false);
    setRejectionEditDraft('');
  }

  async function saveRejectionNote() {
    if (!id || !application) return;
    setIsSavingRejectionNote(true);
    const result = await updateApplicationRejectionObservation(
      id,
      rejectionEditDraft.trim() || null
    );
    if (result.success && result.data) {
      const row = result.data as ApplicationDetail;
      setApplication(prev =>
        prev
          ? {
              ...prev,
              rejection_observation: row.rejection_observation ?? null,
            }
          : null
      );
      setRejectionEditing(false);
    }
    setIsSavingRejectionNote(false);
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
                  onClick={openRejectDialog}
                  disabled={isUpdating || application.status === 'rejected'}
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

        {application.status === 'rejected' && (
          <Card className="mb-6 border-red-200 bg-linear-to-br from-red-50/90 to-white shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-lg text-red-900">
                    Motivo da rejeição
                  </CardTitle>
                  <CardDescription>
                    Registro interno do porquê esta candidatura foi rejeitada.
                  </CardDescription>
                </div>
                {!rejectionEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-red-200 text-red-800 hover:bg-red-100"
                    onClick={startEditingRejectionNote}
                  >
                    Editar
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {rejectionEditing ? (
                <div className="space-y-3">
                  <Label htmlFor="rejection-edit">Observação</Label>
                  <textarea
                    id="rejection-edit"
                    value={rejectionEditDraft}
                    onChange={e => setRejectionEditDraft(e.target.value)}
                    rows={5}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Descreva o motivo da rejeição..."
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      disabled={isSavingRejectionNote}
                      className="bg-red-600 text-white hover:bg-red-700"
                      onClick={saveRejectionNote}
                    >
                      {isSavingRejectionNote ? 'Salvando...' : 'Salvar'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isSavingRejectionNote}
                      onClick={cancelEditingRejectionNote}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : application.rejection_observation ? (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
                  {application.rejection_observation}
                </p>
              ) : (
                <p className="text-sm italic text-slate-500">
                  Nenhuma observação registrada. Use &quot;Editar&quot; para
                  adicionar.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Rejeitar candidatura</DialogTitle>
              <DialogDescription>
                Informe o motivo da rejeição. Esse texto ficará visível nos
                detalhes desta candidatura para consulta futura.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 py-2">
              <Label htmlFor="reject-reason">Observação (obrigatória)</Label>
              <textarea
                id="reject-reason"
                value={rejectObservationDraft}
                onChange={e => {
                  setRejectObservationDraft(e.target.value);
                  if (rejectModalError) setRejectModalError(null);
                }}
                rows={5}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Ex.: Perfil alinhado ao remoto; vaga exige presença integral em Recife."
                disabled={isUpdating}
              />
              {rejectModalError && (
                <p className="text-sm text-red-600">{rejectModalError}</p>
              )}
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setRejectDialogOpen(false)}
                disabled={isUpdating}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={handleConfirmReject}
                disabled={isUpdating}
              >
                {isUpdating ? 'Salvando...' : 'Confirmar rejeição'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Motivação */}
            <Card>
              <CardHeader>
                <CardTitle>Motivação para a Vaga</CardTitle>
                <CardDescription>
                  O que, especificamente, neste desafio faz sentido para você neste momento da sua carreira?
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
                    {outcome.comment ? (
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

            {/* Formulários de Entrevista */}
            <Card>
              <CardHeader>
                <CardTitle>Formulários de Entrevista</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => navigate(`/admin/applications/${id}/screening`)}
                  className="w-full"
                  variant="outline"
                >
                  Triagem Inicial
                </Button>
                <Button
                  onClick={() => navigate(`/admin/applications/${id}/interview`)}
                  className="w-full"
                  variant="outline"
                >
                  Entrevista Principal
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
