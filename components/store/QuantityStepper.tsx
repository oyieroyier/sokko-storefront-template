'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';

const sizes = {
  md: { step: 'h-9 w-9 text-lg', field: 'h-9 w-12 text-sm' },
  sm: { step: 'h-8 w-8 text-base', field: 'h-8 w-10 text-sm' }
} as const;

/**
 * Quantity is clamped to 1..maxQuantity by the SDK, so these buttons stay
 * dumb. The text field cannot be equally dumb.
 *
 * A controlled field wired straight to `onChange(Number(value))` fights the
 * keyboard: clearing it to type a new number sends `Number('')`, which is 0,
 * which the clamp turns into 1, which re-renders the field as "1" before the
 * buyer has typed a digit. So the field holds an uncommitted draft string
 * while it has focus and commits on blur or Enter. `draft` is not a second
 * source of truth: it is null whenever the field is not being edited.
 *
 * `type="text"` with `inputMode="numeric"` rather than `type="number"`: a
 * number input puts spinners in a 32px control and lets a scroll wheel over
 * the page silently change what the buyer is about to pay for.
 */
export function QuantityStepper({
  quantity,
  maxQuantity,
  onChange,
  label = 'Quantity',
  showLabel = true,
  size = 'md'
}: {
  quantity: number;
  maxQuantity: number;
  onChange: (quantity: number) => void;
  /** Names this control for a screen reader. Must be unique on the page. */
  label?: string;
  showLabel?: boolean;
  size?: keyof typeof sizes;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft ?? String(quantity);
  const { step, field } = sizes[size];

  const commit = () => {
    const parsed = Number.parseInt(draft ?? '', 10);
    setDraft(null);
    if (Number.isFinite(parsed)) onChange(parsed);
  };

  const stepClass = cn(
    step,
    'leading-none text-ink transition-brand hover:bg-surface disabled:pointer-events-none disabled:opacity-40'
  );

  return (
    <div className="flex items-center gap-3">
      {showLabel && (
        <span className="text-xs font-medium tracking-wide text-muted uppercase">{label}</span>
      )}
      <div className="flex items-center rounded-control border border-line">
        <button
          type="button"
          aria-label={`Reduce ${label.toLowerCase()}`}
          className={cn(stepClass, 'rounded-l-control')}
          disabled={quantity <= 1}
          onClick={() => onChange(quantity - 1)}
        >
          &minus;
        </button>
        <input
          aria-label={label}
          autoComplete="off"
          className={cn(field, 'border-x border-line bg-transparent text-center')}
          inputMode="numeric"
          onBlur={commit}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              event.currentTarget.blur();
            }
          }}
          pattern="[0-9]*"
          type="text"
          value={shown}
        />
        <button
          type="button"
          aria-label={`Increase ${label.toLowerCase()}`}
          className={cn(stepClass, 'rounded-r-control')}
          disabled={quantity >= maxQuantity}
          onClick={() => onChange(quantity + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}
