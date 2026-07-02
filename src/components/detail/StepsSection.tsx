import { useMemo, useState } from "react";
import { Hotdog } from "@/types/hotdog";
import { Clock, Flame, Lightbulb, AlertTriangle, Check } from "lucide-react";

interface Props {
  hotdog: Hotdog;
}

export function StepsSection({ hotdog }: Props) {
  const steps = hotdog.recipe_steps || [];
  const [done, setDone] = useState<Record<number, boolean>>({});

  const ingredientById = useMemo(() => {
    const map: Record<string, string> = {};
    (hotdog.recipe_ingredients || []).forEach((i) => {
      map[i.id] = i.name;
    });
    return map;
  }, [hotdog.recipe_ingredients]);

  const completed = Object.values(done).filter(Boolean).length;
  const pct = steps.length ? (completed / steps.length) * 100 : 0;

  return (
    <section className="paper-card p-6 md:p-8 lg:p-10">
      <div className="flex items-baseline justify-between flex-wrap gap-3 mb-2">
        <div className="stamp-label">The Build, Step by Step</div>
        <span className="text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--ink))]/60">
          {completed} / {steps.length} done
        </span>
      </div>
      <h3 className="font-heading text-2xl md:text-3xl text-[hsl(var(--ink))] leading-tight">
        Follow the vendor
      </h3>

      {/* Progress bar */}
      <div
        className="mt-4 h-1.5 w-full rounded-full bg-[hsl(var(--ink))]/10 overflow-hidden"
        role="progressbar"
        aria-valuenow={completed}
        aria-valuemax={steps.length}
      >
        <div
          className="h-full bg-[hsl(var(--stamp-red))] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <ol className="mt-8 space-y-6">
        {steps.map((s, i) => {
          const isDone = !!done[i];
          const uses = (s.uses || [])
            .map((id) => ingredientById[id])
            .filter(Boolean);

          return (
            <li
              key={i}
              className={`relative rounded-xl border-2 p-5 md:p-7 transition-all ${
                isDone
                  ? "bg-[hsl(var(--cilantro))]/10 border-[hsl(var(--cilantro))]/40"
                  : "bg-white/60 border-[hsl(var(--paper-edge))]/60"
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  aria-label={isDone ? "Mark step incomplete" : "Mark step complete"}
                  onClick={() =>
                    setDone((p) => ({ ...p, [i]: !p[i] }))
                  }
                  className={`shrink-0 inline-flex items-center justify-center h-11 w-11 rounded-full font-display text-lg border-2 transition-all ${
                    isDone
                      ? "bg-[hsl(var(--cilantro))] border-[hsl(var(--cilantro))] text-white"
                      : "border-[hsl(var(--ink))]/20 hover:border-[hsl(var(--accent-2))]"
                  }`}
                  style={
                    isDone
                      ? undefined
                      : {
                          background: "hsl(var(--accent-1))",
                          color: "hsl(var(--ink))",
                        }
                  }
                >
                  {isDone ? <Check className="h-5 w-5" /> : i + 1}
                </button>

                <div className="min-w-0 flex-1">
                  <h4
                    className={`font-heading text-xl md:text-2xl leading-tight text-[hsl(var(--ink))] ${
                      isDone ? "line-through opacity-60" : ""
                    }`}
                  >
                    {s.title}
                  </h4>

                  {/* Meta chips */}
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[hsl(var(--ink))]/70">
                    {s.duration_min != null && (
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {s.duration_min} min
                      </span>
                    )}
                    {s.temp && s.temp !== "—" && (
                      <span className="inline-flex items-center gap-1.5">
                        <Flame className="h-3.5 w-3.5" />
                        {s.temp}
                      </span>
                    )}
                    {uses.length > 0 && (
                      <span className="inline-flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] uppercase tracking-wider opacity-70">
                          Uses:
                        </span>
                        {uses.map((u) => (
                          <span
                            key={u}
                            className="px-2 py-0.5 rounded-full bg-[hsl(var(--ink))]/8 text-[11px]"
                            style={{ background: "hsl(var(--ink) / 0.06)" }}
                          >
                            {u}
                          </span>
                        ))}
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-[hsl(var(--ink))]/85 leading-relaxed text-[15px]">
                    {s.body}
                  </p>

                  {(s.tip || s.pitfall) && (
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {s.tip && (
                        <div className="rounded-md border-l-4 border-[hsl(var(--cilantro))] bg-[hsl(var(--cilantro))]/8 p-3">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--cilantro))] mb-1">
                            <Lightbulb className="h-3 w-3" />
                            Vendor tip
                          </div>
                          <p className="text-xs text-[hsl(var(--ink))]/80 leading-relaxed">
                            {s.tip}
                          </p>
                        </div>
                      )}
                      {s.pitfall && (
                        <div className="rounded-md border-l-4 border-[hsl(var(--stamp-red))] bg-[hsl(var(--stamp-red))]/8 p-3">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[hsl(var(--stamp-red))] mb-1">
                            <AlertTriangle className="h-3 w-3" />
                            Common pitfall
                          </div>
                          <p className="text-xs text-[hsl(var(--ink))]/80 leading-relaxed">
                            {s.pitfall}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
