import { Building2, ChevronRight, Trash2 } from "lucide-react";
import type { Company } from "../lib/supabase";
import { computeScore, getScoreBand, getCriteriaCount, CRITERIA } from "../lib/criteria";

type CompanyCardProps = {
  company: Company;
  onSelect: (company: Company) => void;
  onDelete: (company: Company) => void;
};

export function CompanyCard({ company, onSelect, onDelete }: CompanyCardProps) {
  const score = computeScore(company.ratings ?? {});
  const band = getScoreBand(score);
  const checkedCount = getCriteriaCount(company.ratings ?? {});
  const progress = (checkedCount / CRITERIA.length) * 100;

  return (
    <div
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/40 p-5 backdrop-blur-sm transition-all duration-300 hover:border-slate-600 hover:bg-slate-800/70 hover:shadow-xl hover:shadow-black/30"
      onClick={() => onSelect(company)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-slate-700/60 ring-1 ring-slate-600/50">
            <Building2 size={20} className="text-slate-300" />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-white">{company.name}</h3>
            {company.sector ? (
              <p className="truncate text-sm text-slate-400">{company.sector}</p>
            ) : (
              <p className="text-sm text-slate-500 italic">Sans secteur</p>
            )}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(company);
          }}
          className="flex-shrink-0 rounded-lg p-2 text-slate-500 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
          aria-label="Supprimer"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tabular-nums" style={{ color: band.color }}>
            {score}%
          </span>
          <span className={`text-xs font-medium ${band.textColor}`}>{band.label}</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-slate-700/40 px-3 py-1 text-xs text-slate-400">
          {checkedCount}/{CRITERIA.length} critères
          <ChevronRight size={14} className="text-slate-500 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-700/40">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%`, backgroundColor: band.color }}
        />
      </div>
    </div>
  );
}
