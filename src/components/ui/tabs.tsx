import { createContext, useContext, useState, type ReactNode } from 'react';

type TabsContextValue = {
  value: string;
  onValueChange: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

export type TabsProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
};

export function Tabs({ value, defaultValue = '', onValueChange, children, className }: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value !== undefined ? value : internalValue;

  function handleChange(next: string) {
    if (value === undefined) {
      setInternalValue(next);
    }
    onValueChange?.(next);
  }

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div role="tablist" className={['flex flex-wrap gap-1 border-b border-border', className ?? ''].join(' ')}>
      {children}
    </div>
  );
}

export type TabsTriggerProps = {
  value: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
};

export function TabsTrigger({ value, children, disabled, className }: TabsTriggerProps) {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error('TabsTrigger must be used inside Tabs');
  }

  const active = context.value === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      aria-controls={`tabpanel-${value}`}
      disabled={disabled}
      onClick={() => context.onValueChange(value)}
      className={[
        'min-h-9 rounded-t-md border-b-2 px-3 py-1.5 text-sm font-medium transition',
        active ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground',
        className ?? '',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

export type TabsContentProps = {
  value: string;
  children: ReactNode;
  className?: string;
};

export function TabsContent({ value, children, className }: TabsContentProps) {
  const context = useContext(TabsContext);

  if (!context || context.value !== value) {
    return null;
  }

  return (
    <div id={`tabpanel-${value}`} role="tabpanel" className={['py-4', className ?? ''].join(' ')}>
      {children}
    </div>
  );
}
