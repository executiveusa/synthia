import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, Activity, TrendingUp, Plus } from "lucide-react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";

/**
 * Admin Dashboard - Overview of SYNTHIA™ Platform
 */
export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = trpc.clients.stats.useQuery();
  const { data: clients, isLoading: clientsLoading } = trpc.clients.list.useQuery();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2">Panel de Control</h1>
            <p className="text-muted-foreground">
              Gestiona clientes y suscripciones de SYNTHIA™
            </p>
          </div>
          <Button className="gradient-teal-purple text-white font-semibold">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Cliente
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="border-primary/20 hover:border-primary transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Clientes
                </CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {statsLoading ? "..." : stats?.totalClients || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Todos los clientes registrados
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="border-secondary/20 hover:border-secondary transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Clientes Activos
                </CardTitle>
                <Activity className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {statsLoading ? "..." : stats?.activeClients || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Con suscripciones activas
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card className="border-accent/20 hover:border-accent transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Ingresos Totales
                </CardTitle>
                <DollarSign className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  ${statsLoading ? "..." : (stats?.totalRevenue || 0).toLocaleString('es-MX')}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  MXN acumulados
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card className="border-primary/20 hover:border-primary transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Suscripciones
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  {statsLoading ? "..." : stats?.activeSubscriptions || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Activas este mes
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Clients Table */}
        <Card>
          <CardHeader>
            <CardTitle>Clientes Recientes</CardTitle>
            <CardDescription>
              Lista de todos los clientes registrados en la plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            {clientsLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Cargando clientes...
              </div>
            ) : !clients || clients.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay clientes registrados aún
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Negocio
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Propietario
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Estado
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Fecha de Registro
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr 
                        key={client.id} 
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm font-medium text-foreground">
                          {client.businessName}
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {client.ownerName}
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {client.email}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              client.status === "active"
                                ? "bg-primary/20 text-primary"
                                : client.status === "pending"
                                ? "bg-accent/20 text-accent"
                                : client.status === "paused"
                                ? "bg-secondary/20 text-secondary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {client.status === "active"
                              ? "Activo"
                              : client.status === "pending"
                              ? "Pendiente"
                              : client.status === "paused"
                              ? "Pausado"
                              : "Cancelado"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {new Date(client.createdAt).toLocaleDateString('es-MX')}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <Button variant="outline" size="sm">
                            Ver Detalles
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
      </div>
    </DashboardLayout>
  );
}
