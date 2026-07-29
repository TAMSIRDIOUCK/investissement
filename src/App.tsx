import { useEffect, useRef, useState } from "react";
import { Plus, Search, TrendingUp, Building2, X, BarChart3, Sparkles } from "lucide-react";
import { supabase, type Company } from "./lib/supabase";
import { computeScore, CRITERIA } from "./lib/criteria";
import { CompanyCard } from "./components/CompanyCard";
import { EvaluationView } from "./components/EvaluationView";

export default function App() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Company | null>(null);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const loadCompanies = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setCompanies((data ?? []) as Company[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleCreate = async (name: string, sector: string) => {
    const { data, error } = await supabase
      .from("companies")
      .insert({ name, sector: sector || null, ratings: {} })
      .select("*")
      .single();

    if (error) {
      setError(error.message);
      return;
    }
    setShowCreate(false);
    await loadCompanies();
    if (data) {
      setSelected(data as Company);
    }
  };

  const handleDelete = async (company: Company) => {
    const { error } = await supabase.from("companies").delete().eq("id", company.id);
    if (error) {
      alert("Erreur : " + error.message);
      return;
    }
    setCompanies((prev) => prev.filter((c) => c.id !== company.id));
  };

  const filtered = companies.filter((c) => {
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || (c.sector ?? "").toLowerCase().includes(q);
  });

  const avgScore =
    companies.length > 0
      ? Math.round(companies.reduce((sum, c) => sum + computeScore(c.ratings ?? {}), 0) / companies.length)
      : 0;

  if (selected) {
    return (
      <div className="min-h-screen bg-slate-900">
        <EvaluationView
          company={selected}
          onBack={() => {
            setSelected(null);
            loadCompanies();
          }}
          onDeleted={() => {
            setSelected(null);
            loadCompanies();
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Background gradient */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-teal-500/5 blur-3xl" />
      </div>

      <div className="relative">
        {/* Header */}
        <header className="border-b border-slate-800/60 bg-slate-900/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 shadow-lg shadow-blue-500/20">
                <BarChart3 size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight text-white">InvestScore</h1>
                <p className="text-xs text-slate-400">Analyse d'investissement</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500 hover:shadow-blue-500/30 active:scale-95"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Nouvelle entreprise</span>
              <span className="sm:hidden">Ajouter</span>
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          {/* Hero stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <StatCard
              icon={<Building2 size={20} />}
              label="Entreprises analysées"
              value={companies.length.toString()}
              accent="text-blue-400"
            />
            <StatCard
              icon={<TrendingUp size={20} />}
              label="Score moyen"
              value={`${avgScore}%`}
              accent="text-teal-400"
            />
            <StatCard
              icon={<Sparkles size={20} />}
              label="Critères d'évaluation"
              value={CRITERIA.length.toString()}
              accent="text-amber-400"
            />
          </div>

          {/* Search */}
          {companies.length > 0 && (
            <div className="relative mb-6">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher une entreprise ou un secteur…"
                className="w-full rounded-xl border border-slate-700/50 bg-slate-800/40 py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 transition-colors focus:border-blue-500 focus:outline-none"
              />
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />
              <p className="mt-4 text-sm">Chargement de vos analyses…</p>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              Erreur de chargement : {error}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && companies.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-700/60 bg-slate-800/20 py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/60 ring-1 ring-slate-700/50">
                <Building2 size={28} className="text-slate-500" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">Aucune entreprise analysée</h3>
              <p className="mt-2 max-w-sm text-sm text-slate-400">
                Commencez par créer une entreprise, puis évaluez-la sur les 10 critères pour obtenir un score d'investissement.
              </p>
              <button
                onClick={() => setShowCreate(true)}
                className="mt-6 flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500 active:scale-95"
              >
                <Plus size={18} />
                Créer ma première analyse
              </button>
            </div>
          )}

          {/* Company grid */}
          {!loading && !error && filtered.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((company) => (
                <CompanyCard
                  key={company.id}
                  company={company}
                  onSelect={setSelected}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {/* No search results */}
          {!loading && !error && companies.length > 0 && filtered.length === 0 && (
            <div className="py-16 text-center text-slate-400">
              <p className="text-sm">Aucune entreprise ne correspond à « {search} ».</p>
            </div>
          )}
        </main>
      </div>

      {/* Create modal */}
      {showCreate && (
        <CreateModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/40 p-4 backdrop-blur-sm transition-colors hover:border-slate-600/70">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-slate-700/40 ${accent}`}>
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold text-white tabular-nums">{value}</div>
          <div className="text-xs text-slate-400">{label}</div>
        </div>
      </div>
    </div>
  );
}

function CreateModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (name: string, sector: string) => void;
}) {
  const [name, setName] = useState("");
  const [sector, setSector] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => nameRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-slate-700/60 bg-slate-800 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus size={20} className="text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Nouvelle entreprise</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Nom de l'entreprise *</label>
            <input
              ref={nameRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && name.trim()) onCreate(name.trim(), sector.trim());
              }}
              placeholder="Ex : Apple, LVMH, TotalÉnergies…"
              className="w-full rounded-xl border border-slate-700/50 bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 transition-colors focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Secteur (optionnel)</label>
            <input
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && name.trim()) onCreate(name.trim(), sector.trim());
              }}
              placeholder="Ex : Technologie, Luxe, Énergie…"
              className="w-full rounded-xl border border-slate-700/50 bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 transition-colors focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-700/60 hover:text-white"
          >
            Annuler
          </button>
          <button
            onClick={() => name.trim() && onCreate(name.trim(), sector.trim())}
            disabled={!name.trim()}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
          >
            Créer et analyser
          </button>
        </div>
      </div>
    </div>
  );
}

