'use client';

import { useState } from 'react';
import type { OptionGroup } from '@sokkoke/storefront-react';
import { CheckoutCurtain } from '@/components/store/CheckoutCurtain';
import { QuantityStepper } from '@/components/store/QuantityStepper';
import { VariantPicker } from '@/components/store/VariantPicker';
import { secondaryButton } from '@/lib/styles';

const groups: OptionGroup[] = [
  { name: 'size', label: 'Size', values: ['S', 'M', 'L', 'XL'] },
  { name: 'colour', label: 'Colour', values: ['Black', 'Bone'] }
];

/**
 * The interactive controls, driven by throwaway local state so the kit can
 * show them working. On a real page this state belongs to the SDK hooks;
 * nothing here is a pattern to copy.
 */
export function ControlsPreview() {
  const [quantity, setQuantity] = useState(1);
  const [selection, setSelection] = useState<Record<string, string>>({ size: 'M' });
  const [curtain, setCurtain] = useState(false);

  return (
    <div className="space-y-block">
      <VariantPicker
        groups={groups}
        onSelect={(name, value) => setSelection((current) => ({ ...current, [name]: value }))}
        selection={selection}
      />
      <div className="flex flex-wrap items-center gap-6">
        <QuantityStepper maxQuantity={10} onChange={setQuantity} quantity={quantity} />
        <QuantityStepper
          label="Small stepper"
          maxQuantity={10}
          onChange={setQuantity}
          quantity={quantity}
          showLabel={false}
          size="sm"
        />
      </div>

      {/* The one state you cannot reach without starting a real checkout.
          It has no close control on purpose: by the time a buyer sees it they
          have committed, so this preview retracts itself. */}
      <button
        type="button"
        className={secondaryButton}
        onClick={() => {
          setCurtain(true);
          window.setTimeout(() => setCurtain(false), 2600);
        }}
      >
        Preview the checkout curtain
      </button>
      <CheckoutCurtain isLeaving={curtain} onCovered={() => {}} />
    </div>
  );
}
