import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  getAllApplications,
  archiveApplication,
  unarchiveApplication,
  deleteApplication,
} from '../service/api';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Trash } from 'lucide-react';

interface Application {
  id: string;
  full_name: string;
  email: string;
  status: string;
  created_at: string;
  city: string;
  state: string;
  archived: boolean;
  screening_completed_at?: string | null;
  interview_completed_at?: string | null;
}

type ViewMode = 'active' | 'archived';

const ITEMS_PER_PAGE = 10;

interface DeleteConfirmModalProps {
  isOpen: boolean;
  applicationName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

function DeleteConfirmModal({
  isOpen,
  applicationName,
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Confirmar Exclusão
        </h3>
        <p className="text-sm text-slate-600 mb-6">
          Tem certeza que deseja excluir a candidatura de{' '}
          <span className="font-semibold">{applicationName}</span>? Esta ação
          não pode ser desfeita.
        </p>

        <div className="flex gap-3 justify-end">
          <Button onClick={onCancel} variant="outline" disabled={isDeleting}>
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
            disabled={isDeleting}
          >
            {isDeleting ? 'Excluindo...' : 'Excluir'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ApplicationsListPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('active');
  const [archivingId, setArchivingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Cálculos de paginação
  const totalPages = Math.ceil(applications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentApplications = applications.slice(startIndex, endIndex);

  useEffect(() => {
    async function loadApplications() {
      setIsLoading(true);
      setCurrentPage(1); // Resetar para primeira página ao mudar modo
      const isArchived = viewMode === 'archived';
      const result = await getAllApplications(isArchived);

      if (result.success && result.data) {
        setApplications(result.data as Application[]);
      }

      setIsLoading(false);
    }

    loadApplications();
  }, [viewMode]);

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  async function handleArchive(id: string) {
    setArchivingId(id);
    const result = await archiveApplication(id);

    if (result.success) {
      // Recarregar lista
      const isArchived = viewMode === 'archived';
      const reloadResult = await getAllApplications(isArchived);
      if (reloadResult.success && reloadResult.data) {
        setApplications(reloadResult.data as Application[]);
      }
    }

    setArchivingId(null);
  }

  function openDeleteModal(id: string, name: string) {
    setApplicationToDelete({ id, name });
    setDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setDeleteModalOpen(false);
    setApplicationToDelete(null);
  }

  async function handleDeleteApplication() {
    if (!applicationToDelete) return;

    setIsDeleting(true);
    const result = await deleteApplication(applicationToDelete.id);

    if (result.success) {
      // Recarregar lista
      const isArchived = viewMode === 'archived';
      const reloadResult = await getAllApplications(isArchived);
      if (reloadResult.success && reloadResult.data) {
        setApplications(reloadResult.data as Application[]);
      }
      closeDeleteModal();
    } else {
      // Você pode adicionar um toast/notification aqui para mostrar o erro
      alert(result.error || 'Erro ao excluir candidatura');
    }

    setIsDeleting(false);
  }

  async function handleUnarchive(id: string) {
    setArchivingId(id);
    const result = await unarchiveApplication(id);

    if (result.success) {
      // Recarregar lista
      const isArchived = viewMode === 'archived';
      const reloadResult = await getAllApplications(isArchived);
      if (reloadResult.success && reloadResult.data) {
        setApplications(reloadResult.data as Application[]);
      }
    }

    setArchivingId(null);
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      approved: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
    };

    const labels = {
      pending: 'Pendente',
      approved: 'Aprovado',
      rejected: 'Rejeitado',
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${
          styles[status as keyof typeof styles] || styles.pending
        }`}
      >
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  function handlePageChange(page: number) {
    setCurrentPage(page);
    // Scroll suave para o topo da tabela
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleViewModeChange(mode: ViewMode) {
    setViewMode(mode);
    setCurrentPage(1);
  }

  return (
    <>
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        applicationName={applicationToDelete?.name || ''}
        onConfirm={handleDeleteApplication}
        onCancel={closeDeleteModal}
        isDeleting={isDeleting}
      />

      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
        {/* Header */}
        <nav className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/admin')}
                  className="text-sm hover:underline"
                >
                  ← Voltar
                </button>
                <h1 className="text-xl font-bold">Candidaturas</h1>
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
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 py-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>
                    {viewMode === 'active'
                      ? 'Candidaturas Ativas'
                      : 'Candidaturas Arquivadas'}
                  </CardTitle>
                  <CardDescription>
                    {applications.length} candidatura(s){' '}
                    {viewMode === 'active' ? 'ativa(s)' : 'arquivada(s)'} •
                    Página {currentPage} de {totalPages || 1}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleViewModeChange('active')}
                    variant={viewMode === 'active' ? 'default' : 'outline'}
                    size="sm"
                  >
                    Ativas
                  </Button>
                  <Button
                    onClick={() => handleViewModeChange('archived')}
                    variant={viewMode === 'archived' ? 'default' : 'outline'}
                    size="sm"
                  >
                    Arquivadas
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-slate-500">Carregando...</p>
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-500">
                    Nenhuma candidatura encontrada
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-sm">
                          Nome
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm">
                          Email
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm">
                          Localização
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm">
                          Status
                        </th>
                        <th className="text-center py-3 px-4 font-semibold text-sm">
                          Triagem
                        </th>
                        <th className="text-center py-3 px-4 font-semibold text-sm">
                          Entrevista
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm">
                          Data
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-sm">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentApplications.map(app => (
                        <tr
                          key={app.id}
                          className="border-b hover:bg-slate-50 transition-colors"
                        >
                          <td className="py-3 px-4 text-base w-full">
                            {app.full_name}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-600">
                            {app.email}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-600">
                            {app.city}, {app.state}
                          </td>
                          <td className="py-3 px-4">
                            {getStatusBadge(app.status)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {app.screening_completed_at ? (
                              <span className="inline-block w-4 h-4 rounded-full bg-green-500"></span>
                            ) : (
                              <span className="inline-block w-4 h-4 rounded-full bg-red-500"></span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {app.interview_completed_at ? (
                              <span className="inline-block w-4 h-4 rounded-full bg-green-500"></span>
                            ) : (
                              <span className="inline-block w-4 h-4 rounded-full bg-red-500"></span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-600">
                            {new Date(app.created_at).toLocaleDateString(
                              'pt-BR'
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button
                                onClick={() =>
                                  navigate(`/admin/applications/${app.id}`)
                                }
                                variant="outline"
                                size="sm"
                              >
                                Ver detalhes
                              </Button>
                              {viewMode === 'active' ? (
                                <Button
                                  onClick={() => handleArchive(app.id)}
                                  variant="outline"
                                  size="sm"
                                  disabled={archivingId === app.id}
                                >
                                  {archivingId === app.id
                                    ? 'Arquivando...'
                                    : 'Arquivar'}
                                </Button>
                              ) : (
                                <Button
                                  onClick={() => handleUnarchive(app.id)}
                                  variant="outline"
                                  size="sm"
                                  disabled={archivingId === app.id}
                                >
                                  {archivingId === app.id
                                    ? 'Desarquivando...'
                                    : 'Desarquivar'}
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                className="border-red-500 text-red-500 hover:bg-red-50"
                                size="sm"
                                onClick={() =>
                                  openDeleteModal(app.id, app.full_name)
                                }
                              >
                                <Trash className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Paginação */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6 pt-4 border-t">
                      <div className="text-sm text-slate-600">
                        Mostrando {startIndex + 1} a{' '}
                        {Math.min(endIndex, applications.length)} de{' '}
                        {applications.length} candidatura(s)
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          variant="outline"
                          size="sm"
                        >
                          ← Anterior
                        </Button>

                        <div className="flex gap-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(page => {
                              // Mostrar sempre primeira, última e páginas próximas à atual
                              if (page === 1 || page === totalPages)
                                return true;
                              if (Math.abs(page - currentPage) <= 1)
                                return true;
                              return false;
                            })
                            .map((page, index, array) => {
                              // Adicionar "..." entre números não consecutivos
                              const prevPage = array[index - 1];
                              const showEllipsis =
                                prevPage && page - prevPage > 1;

                              return (
                                <div key={page} className="flex items-center">
                                  {showEllipsis && (
                                    <span className="px-2 text-slate-400">
                                      ...
                                    </span>
                                  )}
                                  <Button
                                    onClick={() => handlePageChange(page)}
                                    variant={
                                      currentPage === page
                                        ? 'default'
                                        : 'outline'
                                    }
                                    size="sm"
                                    className="min-w-10"
                                  >
                                    {page}
                                  </Button>
                                </div>
                              );
                            })}
                        </div>

                        <Button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          variant="outline"
                          size="sm"
                        >
                          Próxima →
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}
