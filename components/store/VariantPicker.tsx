'use client';

import type { OptionGroup } from '@sokkoke/storefront-react';
import { cn } from '@/lib/cn';

/**
 * The option axes come back from `useVariantSelection` inside
 * `useProductPurchase`. Sokko stores variants as flat option maps, so the
 * groups are recovered from the variants themselves and arrive already
 * title-cased and in the order the seller entered them.
 */
export function VariantPicker({
  groups,
  selection,
  onSelect
}: {
  groups: OptionGroup[];
  selection: Record<string, string>;
  onSelect: (name: string, value: string) => void;
}) {
  if (!groups.length) return null;

  return (
    <div className="space-y-5">
      {groups.map((group) => (
        <fieldset key={group.name}>
          <legend className="text-xs font-medium tracking-wide text-muted uppercase">
            {group.label}
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {group.values.map((value) => {
              const isSelected = selection[group.name] === value;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onSelect(group.name, value)}
                  className={cn(
                    'rounded-control border px-3.5 py-2 text-sm transition-colors',
                    isSelected
                      ? 'border-brand bg-brand text-brand-ink'
                      : 'border-line text-ink hover:bg-surface'
                  )}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
