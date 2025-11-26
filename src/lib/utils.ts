import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCategoryName(name: string): string {
  return name.replace(/_/g, " ");
}

export function parseOptionalIngredient(ingredient: string): { isOptional: boolean; cleanedText: string } {
  // Check for prefix pattern: "Optional: <ingredient>" or "Optional <ingredient>"
  const prefixMatch = ingredient.match(/^Optional[:\s]+(.+)$/i);
  if (prefixMatch) {
    const cleaned = prefixMatch[1].trim();
    return {
      isOptional: true,
      cleanedText: cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
    };
  }

  // Check for suffix pattern: "<ingredient> (optional)" or "<ingredient> (optional, <text>)"
  const suffixMatch = ingredient.match(/^(.+?)\s*\(optional(?:,?\s*[^)]+)?\)\s*$/i);
  if (suffixMatch) {
    return {
      isOptional: true,
      cleanedText: suffixMatch[1].trim()
    };
  }

  return {
    isOptional: false,
    cleanedText: ingredient
  };
}

export function separateOptionalIngredients(ingredients: string[]): { required: string[]; optional: string[] } {
  const required: string[] = [];
  const optional: string[] = [];

  ingredients.forEach(ingredient => {
    const { isOptional, cleanedText } = parseOptionalIngredient(ingredient);
    if (isOptional) {
      optional.push(cleanedText);
    } else {
      required.push(cleanedText);
    }
  });

  return { required, optional };
}
