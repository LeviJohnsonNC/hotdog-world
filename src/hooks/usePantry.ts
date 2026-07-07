import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  STARTER_KIT_INGREDIENTS,
  STARTER_KIT_EQUIPMENT,
  DERIVED_INGREDIENTS,
} from "@/data/pantryTaxonomy";

export interface PantryState {
  ingredient_ids: string[];
  equipment_ids: string[];
}

const EMPTY: PantryState = { ingredient_ids: [], equipment_ids: [] };
const LS_KEY = "pantry:v1"; // anonymous fallback

function readLocal(): PantryState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return EMPTY;
    const p = JSON.parse(raw);
    return {
      ingredient_ids: Array.isArray(p.ingredient_ids) ? p.ingredient_ids : [],
      equipment_ids: Array.isArray(p.equipment_ids) ? p.equipment_ids : [],
    };
  } catch {
    return EMPTY;
  }
}

function writeLocal(p: PantryState) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

export function usePantry() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const userId = user?.id ?? null;

  const { data, isLoading } = useQuery({
    queryKey: ["pantry", userId],
    queryFn: async (): Promise<PantryState> => {
      if (!userId) return readLocal();
      const { data, error } = await supabase
        .from("user_pantry")
        .select("ingredient_ids, equipment_ids")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw error;
      return data
        ? {
            ingredient_ids: data.ingredient_ids || [],
            equipment_ids: data.equipment_ids || [],
          }
        : EMPTY;
    },
  });

  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingState = useRef<PantryState | null>(null);

  const persist = useMutation({
    mutationFn: async (state: PantryState) => {
      if (!userId) {
        writeLocal(state);
        return state;
      }
      const { error } = await supabase
        .from("user_pantry")
        .upsert(
          {
            user_id: userId,
            ingredient_ids: state.ingredient_ids,
            equipment_ids: state.equipment_ids,
          },
          { onConflict: "user_id" }
        );
      if (error) throw error;
      return state;
    },
  });

  const schedulePersist = useCallback(
    (next: PantryState) => {
      pendingState.current = next;
      if (persistTimer.current) clearTimeout(persistTimer.current);
      persistTimer.current = setTimeout(() => {
        if (pendingState.current) persist.mutate(pendingState.current);
      }, 350);
    },
    [persist]
  );

  const setState = useCallback(
    (updater: (prev: PantryState) => PantryState) => {
      const prev = qc.getQueryData<PantryState>(["pantry", userId]) ?? EMPTY;
      const next = updater(prev);
      qc.setQueryData(["pantry", userId], next);
      schedulePersist(next);
    },
    [qc, userId, schedulePersist]
  );

  const toggleIngredient = useCallback(
    (id: string) => {
      setState((prev) => {
        const has = prev.ingredient_ids.includes(id);
        return {
          ...prev,
          ingredient_ids: has
            ? prev.ingredient_ids.filter((x) => x !== id)
            : [...prev.ingredient_ids, id],
        };
      });
    },
    [setState]
  );

  const toggleEquipment = useCallback(
    (id: string) => {
      setState((prev) => {
        const has = prev.equipment_ids.includes(id);
        return {
          ...prev,
          equipment_ids: has
            ? prev.equipment_ids.filter((x) => x !== id)
            : [...prev.equipment_ids, id],
        };
      });
    },
    [setState]
  );

  const addStarterKit = useCallback(() => {
    setState((prev) => ({
      ingredient_ids: Array.from(
        new Set([...prev.ingredient_ids, ...STARTER_KIT_INGREDIENTS])
      ),
      equipment_ids: Array.from(
        new Set([...prev.equipment_ids, ...STARTER_KIT_EQUIPMENT])
      ),
    }));
  }, [setState]);

  const clearAll = useCallback(() => {
    setState(() => EMPTY);
  }, [setState]);

  // Flush pending writes on unmount
  useEffect(() => {
    return () => {
      if (persistTimer.current) clearTimeout(persistTimer.current);
      if (pendingState.current) persist.mutate(pendingState.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pantry = data ?? EMPTY;

  return {
    pantry,
    isLoading,
    isSignedIn: !!userId,
    toggleIngredient,
    toggleEquipment,
    addStarterKit,
    clearAll,
  };
}

/** Returns true when the pantry covers every required ingredient AND equipment. */
export function canMakeHotdog(
  hotdog: { canonical_ingredient_ids?: string[]; canonical_equipment_ids?: string[] },
  pantry: PantryState
): boolean {
  const ings = hotdog.canonical_ingredient_ids ?? [];
  const eqs = hotdog.canonical_equipment_ids ?? [];
  if (ings.length === 0) return false; // guard against unpopulated rows
  const ownedI = new Set(pantry.ingredient_ids);
  const ownedE = new Set(pantry.equipment_ids);
  return ings.every((i) => ownedI.has(i)) && eqs.every((e) => ownedE.has(e));
}

/** How many items are missing from the pantry to make this hotdog. */
export function missingCount(
  hotdog: { canonical_ingredient_ids?: string[]; canonical_equipment_ids?: string[] },
  pantry: PantryState
): { total: number; missingIngredients: string[]; missingEquipment: string[] } {
  const ownedI = new Set(pantry.ingredient_ids);
  const ownedE = new Set(pantry.equipment_ids);
  const missingIngredients = (hotdog.canonical_ingredient_ids ?? []).filter(
    (i) => !ownedI.has(i)
  );
  const missingEquipment = (hotdog.canonical_equipment_ids ?? []).filter(
    (e) => !ownedE.has(e)
  );
  return {
    total: missingIngredients.length + missingEquipment.length,
    missingIngredients,
    missingEquipment,
  };
}
