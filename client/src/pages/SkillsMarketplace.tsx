import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Sparkles, Zap, TrendingUp, Users, MessageSquare, Palette, Code, BarChart3, Mail } from "lucide-react";
import { motion } from "framer-motion";

const categoryIcons: Record<string, any> = {
  productivity: Zap,
  communication: MessageSquare,
  marketing: TrendingUp,
  design: Palette,
  development: Code,
  business: BarChart3,
  automation: Sparkles,
  content: Mail,
  data: BarChart3,
  general: Users,
};

const categoryColors: Record<string, string> = {
  productivity: "bg-teal-500/10 text-teal-600 border-teal-500/20",
  communication: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  marketing: "bg-coral-500/10 text-coral-600 border-coral-500/20",
  design: "bg-pink-500/10 text-pink-600 border-pink-500/20",
  development: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  business: "bg-green-500/10 text-green-600 border-green-500/20",
  automation: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  content: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  data: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  general: "bg-gray-500/10 text-gray-600 border-gray-500/20",
};

export default function SkillsMarketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: allSkills, isLoading: loadingAll } = trpc.skills.list.useQuery();
  const { data: stats } = trpc.skills.stats.useQuery();
  const { data: searchResults, isLoading: loadingSearch } = trpc.skills.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length > 2 }
  );
  const { data: categorySkills, isLoading: loadingCategory } = trpc.skills.byCategory.useQuery(
    { category: selectedCategory! },
    { enabled: !!selectedCategory }
  );

  const displaySkills = searchQuery.length > 2 
    ? searchResults 
    : selectedCategory 
    ? categorySkills 
    : allSkills;

  const isLoading = loadingAll || loadingSearch || loadingCategory;

  const categories = stats?.byCategory ? Object.entries(stats.byCategory) : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-500/10 via-purple-500/10 to-coral-500/10 py-20">
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-medium text-teal-600">
                {stats?.totalSkills || 0} Skills Disponibles
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-teal-600 via-purple-600 to-coral-600 bg-clip-text text-transparent">
              Marketplace de Skills
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8">
              Potencia tu asistente de WhatsApp con más de 2,000 habilidades especializadas.
              Desde automatización hasta marketing, encuentra todo lo que necesitas.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar skills... (ej: 'email automation', 'social media', 'analytics')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg rounded-full border-2 focus:border-teal-500"
              />
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-teal-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />
      </section>

      {/* Stats Section */}
      <section className="py-12 border-b">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-teal-600 mb-2">
                {stats?.totalSkills || 0}
              </div>
              <div className="text-sm text-muted-foreground">Skills Totales</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {categories.length}
              </div>
              <div className="text-sm text-muted-foreground">Categorías</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-coral-600 mb-2">
                {stats?.bySource?.["clawdbot"] || 0}
              </div>
              <div className="text-sm text-muted-foreground">Clawdbot Skills</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-pink-600 mb-2">
                {stats?.bySource?.["n8n"] || 0}
              </div>
              <div className="text-sm text-muted-foreground">n8n Workflows</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12">
        <div className="container">
          <h2 className="text-2xl font-bold mb-6">Explorar por Categoría</h2>
          
          <div className="flex flex-wrap gap-3 mb-8">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="rounded-full"
            >
              Todas
            </Button>
            {categories.map(([category, count]) => {
              const Icon = categoryIcons[category] || Users;
              return (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                  <Badge variant="secondary" className="ml-1">
                    {count}
                  </Badge>
                </Button>
              );
            })}
          </div>

          {/* Skills Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-muted rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : displaySkills && displaySkills.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {displaySkills.map((skill, index) => {
                const Icon = categoryIcons[skill.category] || Users;
                const colorClass = categoryColors[skill.category] || categoryColors.general;
                
                return (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-teal-500/50">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div className={`p-2 rounded-lg ${colorClass} border`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {skill.source}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg line-clamp-1">{skill.name}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {skill.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge className={colorClass}>
                            {skill.category}
                          </Badge>
                          {skill.subcategory && (
                            <Badge variant="secondary" className="text-xs">
                              {skill.subcategory}
                            </Badge>
                          )}
                        </div>
                        <Button className="w-full" variant="outline">
                          Ver Detalles
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No se encontraron skills</h3>
              <p className="text-muted-foreground">
                Intenta con otra búsqueda o categoría
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
