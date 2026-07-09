import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  Search,
  Sparkles,
  Check,
  ChefHat,
  Utensils,
  Trash2,
  Lock,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  INGREDIENTS,
  EQUIPMENT,
  INGREDIENT_CATEGORY_ORDER,
  INGREDIENT_CATEGORY_LABELS,
  EQUIPMENT_CATEGORY_LABELS,
  type PantryCategory,
  type EquipmentCategory,
} from "@/data/pantryTaxonomy";
import { usePantry, canMakeHotdog, missingCount } from "@/hooks/usePantry";
import { useHotdogsLight } from "@/hooks/useHotdogsLight";
import { useAuth } from "@/contexts/AuthContext";

function findIngredientLabel(id: string) {
  return INGREDIENTS.find((i) => i.id === id)?.label ?? id;
}
function findEquipmentLabel(id: string) {
  return EQUIPMENT.find((i) => i.id === id)?.label ?? id;
}

export default function Pantry() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    pantry,
    isSignedIn,
    toggleIngredient,
    toggleEquipment,
    addStarterKit,
    clearAll,
  } = usePantry();
  const { data: hotdogs = [] } = useHotdogsLight();
  const [q, setQ] = useState("");

  const ownedIngSet = useMemo(() => new Set(pantry.ingredient_ids), [pantry]);
  const ownedEqSet = useMemo(() => new Set(pantry.equipment_ids), [pantry]);

  const filteredIngredients = useMemo(() => {
    if (!q.trim()) return INGREDIENTS;
    const s = q.toLowerCase();
    return INGREDIENTS.filter((i) => i.label.toLowerCase().includes(s));
  }, [q]);

  const byCategory = useMemo(() => {
    const map: Record<PantryCategory, typeof INGREDIENTS> = {
      protein: [],
      bread: [],
      produce: [],
      dairy: [],
      sauces: [],
      spices: [],
    };
    for (const i of filteredIngredients) map[i.category].push(i);
    return map;
  }, [filteredIngredients]);

  const equipmentByCategory = useMemo(() => {
    const map: Record<EquipmentCategory, typeof EQUIPMENT> = {
      cooking: [],
      tools: [],
    };
    for (const e of EQUIPMENT) map[e.category].push(e);
    return map;
  }, []);

  // Match analysis
  const analysis = useMemo(() => {
    const ready: typeof hotdogs = [];
    const almost: Array<{ hotdog: (typeof hotdogs)[number]; missing: ReturnType<typeof missingCount> }> = [];
    for (const h of hotdogs) {
      if (!h.canonical_ingredient_ids || h.canonical_ingredient_ids.length === 0)
        continue;
      if (canMakeHotdog(h, pantry)) {
        ready.push(h);
      } else {
        const miss = missingCount(h, pantry);
        if (miss.total > 0 && miss.total <= 3) almost.push({ hotdog: h, missing: miss });
      }
    }
    almost.sort((a, b) => a.missing.total - b.missing.total);
    return { ready, almost };
  }, [hotdogs, pantry]);

  const totalOwned = pantry.ingredient_ids.length + pantry.equipment_ids.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-mustard/10">
      <Helmet>
        <title>My Pantry — What Can I Make? | Hotdogs Around the World</title>
        <meta
          name="description"
          content="Check off the ingredients and tools in your kitchen and instantly see which iconic hot dogs from around the world you can make tonight."
        />
      </Helmet>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-card/85 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Button onClick={() => navigate("/")} variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Home
          </Button>
          <div className="text-center flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              My Pantry
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {totalOwned === 0
                ? "Check off what's in your kitchen"
                : `${pantry.ingredient_ids.length} ingredients · ${pantry.equipment_ids.length} tools`}
            </p>
          </div>
          <Link to="/hotdogs">
            <Button size="sm" className="gap-2">
              <ChefHat className="h-4 w-4" />
              <span className="hidden sm:inline">Cook</span>
              <span className="tabular-nums font-semibold">{analysis.ready.length}</span>
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* LEFT: pantry editor */}
        <div className="space-y-6">
          {/* Search + starter kit */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                aria-label="Search ingredients and equipment"
                placeholder="Search ingredients (e.g. mustard, chorizo, sriracha…)"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
            <Button variant="outline" onClick={addStarterKit} className="gap-2">
              <Sparkles className="h-4 w-4 text-mustard" />
              Add starter kit
            </Button>
            {totalOwned > 0 && (
              <Button
                variant="ghost"
                onClick={clearAll}
                className="gap-2 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>

          {/* Ingredients */}
          {INGREDIENT_CATEGORY_ORDER.map((cat) => {
            const items = byCategory[cat];
            if (items.length === 0) return null;
            const owned = items.filter((i) => ownedIngSet.has(i.id)).length;
            return (
              <CategorySection
                key={cat}
                title={INGREDIENT_CATEGORY_LABELS[cat]}
                owned={owned}
                total={items.length}
                icon={<Utensils className="h-4 w-4" />}
              >
                <div className="flex flex-wrap gap-2 pt-3">
                  {items.map((it) => (
                    <IngredientChip
                      key={it.id}
                      label={it.label}
                      checked={ownedIngSet.has(it.id)}
                      onClick={() => toggleIngredient(it.id)}
                    />
                  ))}
                </div>
              </CategorySection>
            );
          })}

          {/* Equipment */}
          <div className="pt-2">
            <h2 className="text-lg font-heading font-semibold text-foreground mb-1">
              Kitchen equipment
            </h2>
            <p className="text-xs text-muted-foreground mb-3">
              We assume you already have a knife, cutting board, bowls, tongs, and measuring tools.
            </p>
            {(Object.keys(equipmentByCategory) as EquipmentCategory[]).map((cat) => {
              const items = equipmentByCategory[cat];
              if (items.length === 0) return null;
              const owned = items.filter((i) => ownedEqSet.has(i.id)).length;
              return (
                <CategorySection
                  key={cat}
                  title={EQUIPMENT_CATEGORY_LABELS[cat]}
                  owned={owned}
                  total={items.length}
                  icon={<ChefHat className="h-4 w-4" />}
                >
                  <div className="flex flex-wrap gap-2 pt-3">
                    {items.map((it) => (
                      <IngredientChip
                        key={it.id}
                        label={it.label}
                        checked={ownedEqSet.has(it.id)}
                        onClick={() => toggleEquipment(it.id)}
                      />
                    ))}
                  </div>
                </CategorySection>
              );
            })}
          </div>
        </div>

        {/* RIGHT: what's unlocking */}
        <aside className="space-y-4 lg:sticky lg:top-24 self-start">
          {!isSignedIn && (
            <Card className="p-4 bg-mustard/10 border-mustard/40">
              <div className="flex gap-3 items-start">
                <Lock className="h-5 w-5 text-mustard mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    Sign in to save your pantry
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Right now it lives on this device only. Sign in and it syncs everywhere.
                  </p>
                  <Button size="sm" onClick={() => navigate("/auth")}>
                    Sign in
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <Card className="p-4 bg-card/70 backdrop-blur border-border/60">
            <div className="flex items-baseline justify-between mb-2">
              <h3 className="font-heading text-lg font-semibold">
                Ready to cook
              </h3>
              <span className="text-2xl font-bold text-mustard tabular-nums">
                {analysis.ready.length}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Hotdogs your pantry fully covers.
            </p>
            {analysis.ready.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                Nothing yet — add a bun, a sausage, and a couple of condiments to unlock your first match.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {analysis.ready.slice(0, 10).map((h) => (
                  <Link
                    key={h.id}
                    to={`/hotdog/${h.slug}`}
                    className="text-xs px-2.5 py-1 rounded-full bg-mustard/15 border border-mustard/30 hover:bg-mustard/25 transition-colors"
                  >
                    {h.name}
                  </Link>
                ))}
                {analysis.ready.length > 10 && (
                  <Link
                    to="/hotdogs?filter=pantry"
                    className="text-xs px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30 hover:bg-primary/20"
                  >
                    +{analysis.ready.length - 10} more →
                  </Link>
                )}
              </div>
            )}
          </Card>

          <Card className="p-4 bg-card/70 backdrop-blur border-border/60">
            <h3 className="font-heading text-lg font-semibold mb-1">
              Almost there
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Add one of these and unlock the dog. Tap a chip to add it.
            </p>
            {analysis.almost.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                Fill in a few more staples and near-matches will appear here.
              </p>
            ) : (
              <div className="space-y-3">
                {analysis.almost.slice(0, 5).map(({ hotdog, missing }) => (
                  <div
                    key={hotdog.id}
                    className="p-3 rounded-lg bg-background/40 border border-border/40"
                  >
                    <div className="flex items-baseline justify-between mb-2">
                      <Link
                        to={`/hotdog/${hotdog.slug}`}
                        className="text-sm font-medium text-foreground hover:text-primary"
                      >
                        {hotdog.name}
                      </Link>
                      <Badge variant="secondary" className="text-[10px]">
                        {missing.total} away
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {missing.missingIngredients.map((id) => (
                        <button
                          key={id}
                          onClick={() => toggleIngredient(id)}
                          className="text-[11px] px-2 py-0.5 rounded-full border border-dashed border-primary/40 text-primary hover:bg-primary/10 hover:border-primary transition-colors inline-flex items-center gap-1"
                        >
                          <Plus className="h-3 w-3" />
                          {findIngredientLabel(id)}
                        </button>
                      ))}
                      {missing.missingEquipment.map((id) => (
                        <button
                          key={id}
                          onClick={() => toggleEquipment(id)}
                          className="text-[11px] px-2 py-0.5 rounded-full border border-dashed border-mustard/60 text-background dark:text-foreground bg-mustard/5 hover:bg-mustard/15 transition-colors inline-flex items-center gap-1"
                        >
                          <Plus className="h-3 w-3" />
                          {findEquipmentLabel(id)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </aside>
      </main>
    </div>
  );
}

function CategorySection({
  title,
  owned,
  total,
  icon,
  children,
}: {
  title: string;
  owned: number;
  total: number;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  const pct = total === 0 ? 0 : (owned / total) * 100;
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className="overflow-hidden bg-card/60 backdrop-blur border-border/50">
        <CollapsibleTrigger asChild>
          <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/30 transition-colors">
            <span className="text-muted-foreground">{icon}</span>
            <span className="flex-1 text-left font-medium text-foreground">
              {title}
            </span>
            <span className="text-xs text-muted-foreground tabular-nums">
              {owned}/{total}
            </span>
            <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-mustard transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform",
                open && "rotate-180"
              )}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4">{children}</div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

function IngredientChip({
  label,
  checked,
  onClick,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all duration-150 active:scale-95",
        checked
          ? "bg-mustard text-background dark:text-foreground border-mustard shadow-sm"
          : "bg-background/60 text-foreground/80 border-border hover:border-mustard/60 hover:bg-mustard/10"
      )}
    >
      <span
        className={cn(
          "w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors",
          checked ? "bg-white/95 border-white" : "border-border/70 bg-background/60"
        )}
      >
        {checked && <Check className="h-3 w-3 text-mustard" strokeWidth={3} />}
      </span>
      <span className="leading-none">{label}</span>
    </button>
  );
}
