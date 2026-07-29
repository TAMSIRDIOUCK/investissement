import { useEffect, useState } from "react";
import { ArrowLeft, Building2, Save, Trash2, TrendingUp, Sparkles } from "lucide-react";
import type { Company } from "../lib/supabase";
import { supabase } from "../lib/supabase";
import { CRITERIA, computeScore, getScoreBand, getCriteriaCount } from "../lib/criteria";
import { StarRating, ScoreRing, AnimatedNumber } from "./StarRating";

type EvaluationViewProps = {
  company: Company;
  onBack: () => void;
  onDeleted: () => void;
};

export function EvaluationView({ company, onBack, onDeleted }: EvaluationViewProps) {
  const [ratings, setRatings] = useState<Record<string, number>>(company.ratings ?? {});
  const [name, setName] = useState(company.name);
  const [sector, setSector] = useState(company.sector ?? "");
  const [notes, setNotes] = useState(company.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    setRatings(company.ratings ?? {});
    setName(company.name);
    setSector(company.sector ?? "");
    setNotes(company.notes ?? "");
  }, [company]);

  const score = computeScore(ratings);
  const band = getScoreBand(score);
  const checkedCount = getCriteriaCount(ratings);

  const updateRating = (key: string, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("companies")
      .update({ name, sector: sector || null, notes: notes || null, ratings })
      .eq("id", company.id);
    setSaving(false);
    if (error) {
      alert("Erreur lors de la sauvegarde : " + error.message);
    } else {
      setSavedAt(Date.now());
      setTimeout(() => setSavedAt(null), 2500);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      setTimeout(() => setDeleteConfirm(false), 3000);
      return;
    }
    const { error } = await supabase.from("companies").delete().eq("id", company.id);
    if (error) {
      alert("Erreur lors de la suppression : " + error.message);
      return;
    }
    onDeleted();
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800/60 hover:text-white"
        >
          <ArrowLeft size={18} />
          Retour
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDelete}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all ${
              deleteConfirm
                ? "bg-red-500 text-white"
                : "text-slate-400 hover:bg-red-500/10 hover:text-red-400"
            }`}
          >
            <Trash2 size={16} />
            {deleteConfirm ? "Confirmer ?" : "Supprimer"}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-500 disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Sauvegarde…" : savedAt ? "Enregistré !" : "Enregistrer"}
          </button>
        </div>
      </div>

      {/* Title section */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-slate-700/40 ring-1 ring-slate-600/50">
            <Building2 size={26} className="text-blue-400" />
          </div>
          <div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-b border-transparent bg-transparent text-2xl font-bold text-white transition-colors hover:border-slate-600 focus:border-blue-500 focus:outline-none"
              placeholder="Nom de l'entreprise"
            />
            <input
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="mt-1 block border-b border-transparent bg-transparent text-sm text-slate-400 transition-colors hover:border-slate-600 focus:border-blue-500 focus:outline-none"
              placeholder="Secteur d'activité"
            />
          </div>
        </div>
      </div>

      {/* Score summary */}
      <div
        className={`mb-8 overflow-hidden rounded-3xl border bg-gradient-to-br p-6 transition-all sm:p-8 ${
          score >= 70
            ? "border-emerald-500/30 from-emerald-500/10 to-slate-900/40"
            : score >= 50
              ? "border-amber-500/30 from-amber-500/10 to-slate-900/40"
              : "border-red-500/30 from-red-500/10 to-slate-900/40"
        }`}
      >
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:gap-10">
          <div className="flex-shrink-0">
            <ScoreRing score={score} />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="mb-2 flex items-center justify-center gap-2 sm:justify-start">
              <TrendingUp size={18} style={{ color: band.color }} />
              <span className="text-sm font-medium uppercase tracking-wider" style={{ color: band.color }}>
                Score d'investissement
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white">
              <AnimatedNumber value={score} className="tabular-nums" />% — {band.label}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300">{band.recommendation}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-4 sm:justify-start">
              <Stat label="Critères évalués" value={`${checkedCount}/${CRITERIA.length}`} />
              <Stat label="Étoiles obtenues" value={`${Object.values(ratings).reduce((a, b) => a + b, 0)}/50`} />
            </div>
          </div>
        </div>
      </div>

      {/* Criteria grid */}
      <div className="mb-4 flex items-center gap-2">
        <Sparkles size={18} className="text-amber-400" />
        <h3 className="text-lg font-semibold text-white">Critères d'évaluation</h3>
      </div>
      <p className="mb-6 text-sm text-slate-400">
        Cliquez sur les étoiles pour noter chaque critère, de 0 (non évalué) à 5 (excellent). Le score se met à jour automatiquement.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {CRITERIA.map((criterion) => {
          const value = ratings[criterion.key] ?? 0;
          const isActive = value > 0;
          return (
            <div
              key={criterion.key}
              className={`rounded-2xl border p-4 transition-all duration-300 ${
                isActive
                  ? "border-slate-600/80 bg-slate-800/60"
                  : "border-slate-700/40 bg-slate-800/20"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-white">{criterion.label}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">{criterion.description}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <StarRating
                  value={value}
                  max={criterion.maxStars}
                  onChange={(v) => updateRating(criterion.key, v)}
                  size={22}
                />
                <span className="text-xs tabular-nums text-slate-500">
                  {value}/{criterion.maxStars}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Notes */}
      <div className="mt-8">
        <h3 className="mb-3 text-lg font-semibold text-white">Notes</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Ajoutez vos observations, recherches ou remarques sur cette entreprise…"
          className="w-full resize-y rounded-xl border border-slate-700/50 bg-slate-800/40 p-4 text-sm text-slate-200 placeholder:text-slate-500 transition-colors focus:border-blue-500 focus:outline-none"
        />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-800/60 px-4 py-2 ring-1 ring-slate-700/50">
      <div className="text-xs text-slate-400">{label}</div>
      <div className="text-base font-semibold text-white tabular-nums">{value}</div>
    </div>
  );
}
