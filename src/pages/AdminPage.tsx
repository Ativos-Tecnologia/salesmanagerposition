import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getApplicationsStats } from '../service/api';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/card';

export function AdminPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setIsLoading(true);
      const result = await getApplicationsStats();

      if (result.success && result.data) {
        setStats(result.data);
      }

      setIsLoading(false);
    }

    loadStats();
  }, []);

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-bold">Painel Administrativo</h1>
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
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">
              Bem-vindo ao painel administrativo!
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-slate-500">Carregando estatísticas...</p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                    <h3 className="text-sm font-semibold text-blue-900 mb-2">
                      Total de Aplicações
                    </h3>
                    <p className="text-3xl font-bold text-blue-600">
                      {stats.total}
                    </p>
                    <p className="text-blue-700 text-xs mt-2">
                      Candidaturas recebidas
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-6 border border-yellow-200">
                    <h3 className="text-sm font-semibold text-yellow-900 mb-2">
                      Pendentes
                    </h3>
                    <p className="text-3xl font-bold text-yellow-600">
                      {stats.pending}
                    </p>
                    <p className="text-yellow-700 text-xs mt-2">
                      Aguardando análise
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                    <h3 className="text-sm font-semibold text-green-900 mb-2">
                      Aprovados
                    </h3>
                    <p className="text-3xl font-bold text-green-600">
                      {stats.approved}
                    </p>
                    <p className="text-green-700 text-xs mt-2">
                      Candidatos selecionados
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 border border-red-200">
                    <h3 className="text-sm font-semibold text-red-900 mb-2">
                      Rejeitados
                    </h3>
                    <p className="text-3xl font-bold text-red-600">
                      {stats.rejected}
                    </p>
                    <p className="text-red-700 text-xs mt-2">
                      Candidaturas rejeitadas
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => navigate('/admin/applications')}
                    size="lg"
                  >
                    Ver todas as candidaturas
                  </Button>
                  <Button
                    onClick={() => navigate('/')}
                    variant="outline"
                    size="lg"
                  >
                    Ir para o site
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
