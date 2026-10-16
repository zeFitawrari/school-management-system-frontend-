import type { InputHTMLAttributes } from 'react';

export type SearchInputProps = InputHTMLAttributes<HTMLInputElement> & {
  loading?: boolean;
  onClear?: () => void;
};

export function SearchInput({ loading, onClear, value, className, ...props }: SearchInputProps) {
  const hasValue = value !== undefined && value !== null && String(value).length > 0;

  return (
    <div className="relative">
      <input
        type="search"
        value={value}
        className={[
          'min-h-11 w-full rounded-md border border-input bg-background py-2 pl-10 pr-10 text-base text-foreground outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring',
          className ?? '',
        ].join(' ')}
        {...props}
      />
      <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        search
      </span>
      {loading ? (
        <span aria-hidden="true" className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
      ) : hasValue && onClear ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={onClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 text-sm text-muted-foreground hover:text-foreground"
        >
          ×
        </button>
      ) : null}
    </div>
  );
}
