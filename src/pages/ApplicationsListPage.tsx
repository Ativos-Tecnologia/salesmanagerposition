/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getAllApplications } from '../service/api';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';

interface Application {
  id: string;
  full_name: string;
  email: string;
  status: string;
  created_at: string;
  city: string;
  state: string;
}

export function ApplicationsListPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function loadApplications() {
    setIsLoading(true);
    const result = await getAllApplications();

    if (result.success && result.data) {
      setApplications(result.data as Application[]);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    loadApplications();
  }, []);

  async function handleSignOut() {
    await signOut();
    navigate('/login');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Todas as Candidaturas</CardTitle>
            <CardDescription>
              {applications.length} candidatura(s) recebida(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-slate-500">Carregando...</p>
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-500">Nenhuma candidatura encontrada</p>
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
                      <th className="text-left py-3 px-4 font-semibold text-sm">
                        Data
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-sm">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(app => (
                      <tr
                        key={app.id}
                        className="border-b hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-3 px-4">{app.full_name}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">
                          {app.email}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">
                          {app.city}, {app.state}
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(app.status)}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">
                          {new Date(app.created_at).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            onClick={() =>
                              navigate(`/admin/applications/${app.id}`)
                            }
                            variant="outline"
                            size="sm"
                          >
                            Ver detalhes
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
