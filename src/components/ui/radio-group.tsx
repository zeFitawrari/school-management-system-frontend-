import { createContext, useContext, useId, useState, type ReactNode } from 'react';

type RadioGroupContextValue = {
  name: string;
  value?: string;
  onChange: (value: string) => void;
};

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export type RadioGroupProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  children: ReactNode;
  className?: string;
};

export function RadioGroup({ value, defaultValue, onValueChange, name, children, className }: RadioGroupProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const generatedName = useId();
  const groupName = name ?? generatedName;
  const currentValue = value !== undefined ? value : internalValue;

  function handleChange(next: string) {
    if (value === undefined) {
      setInternalValue(next);
    }
    onValueChange?.(next);
  }

  return (
    <RadioGroupContext.Provider value={{ name: groupName, value: currentValue, onChange: handleChange }}>
      <div role="radiogroup" className={className}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export type RadioGroupItemProps = {
  value: string;
  label?: string;
  disabled?: boolean;
  id?: string;
};

export function RadioGroupItem({ value, label, disabled, id }: RadioGroupItemProps) {
  const context = useContext(RadioGroupContext);

  if (!context) {
    throw new Error('RadioGroupItem must be used inside RadioGroup');
  }

  const generatedId = useId();
  const itemId = id ?? generatedId;
  const checked = context.value === value;

  return (
    <div className="flex items-center gap-2">
      <input
        id={itemId}
        type="radio"
        name={context.name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => context.onChange(value)}
        className="h-4 w-4 border border-input text-primary focus-visible:ring-2 focus-visible:ring-ring"
      />
      {label ? (
        <label htmlFor={itemId} className="text-sm text-foreground">
          {label}
        </label>
      ) : null}
    </div>
  );
}
