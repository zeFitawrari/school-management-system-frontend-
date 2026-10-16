import { useState, type ButtonHTMLAttributes } from 'react';

export type SwitchProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
};

export function Switch({ checked, defaultChecked, onCheckedChange, label, className, ...props }: SwitchProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);
  const isChecked = checked !== undefined ? checked : internalChecked;

  function handleToggle() {
    const next = !isChecked;
    if (checked === undefined) {
      setInternalChecked(next);
    }
    onCheckedChange?.(next);
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      aria-label={label}
      onClick={handleToggle}
      className={[
        'relative inline-flex h-6 w-11 items-center rounded-full border border-border transition',
        isChecked ? 'bg-primary' : 'bg-muted',
        className ?? '',
      ].join(' ')}
      {...props}
    >
      <span
        className={[
          'inline-block h-5 w-5 transform rounded-full bg-background shadow transition',
          isChecked ? 'translate-x-5' : 'translate-x-0.5',
        ].join(' ')}
      />
    </button>
  );
}
