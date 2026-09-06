'use client';

import { cn } from '@/lib/cn';

/** Quantity is clamped by the SDK, so these buttons can stay dumb. */
export function QuantityStepper({
  quantity,
  maxQuantity,
  onChange
}: {
  quantity: number;
  maxQuantity: number;
  onChange: (quantity: number) => void;
}) {
  const step = 'h-9 w-9 text-lg leading-none transition-colors hover:bg-surface disabled:opacity-40';

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium tracking-wide text-muted uppercase">Quantity</span>
      <div className="flex items-center rounded-control border border-line">
        <button
          type="button"
          aria-label="Reduce quantity"
          className={cn(step, 'rounded-l-control')}
          disabled={quantity <= 1}
          onClick={() => onChange(quantity - 1)}
        >
          &minus;
        </button>
        <input
          aria-label="Quantity"
          className="h-9 w-12 border-x border-line bg-transparent text-center text-sm"
          inputMode="numeric"
          max={maxQuantity}
          min={1}
          onChange={(event) => onChange(Number(event.target.value))}
          type="number"
          value={quantity}
        />
        <button
          type="button"
          aria-label="Increase quantity"
          className={cn(step, 'rounded-r-control')}
          disabled={quantity >= maxQuantity}
          onClick={() => onChange(quantity + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}
