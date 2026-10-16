import { useId, type TextareaHTMLAttributes } from 'react';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: string;
  error?: string;
};

export function Textarea({ label, hint, error, id, className, ...props }: TextareaProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const descriptionId = `${fieldId}-description`;
  const hasDescription = Boolean(hint || error);

  return (
    <div className="space-y-1">
      {label ? (
        <label htmlFor={fieldId} className="block text-sm font-medium text-foreground">
          {label}
        </label>
      ) : null}
      <textarea
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={hasDescription ? descriptionId : undefined}
        className={[
          'min-h-24 w-full rounded-md border bg-background px-3 py-2 text-base text-foreground outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring',
          error ? 'border-danger' : 'border-input',
          className ?? '',
        ].join(' ')}
        {...props}
      />
      {hasDescription ? (
        <p
          id={descriptionId}
          className={error ? 'text-sm text-danger' : 'text-sm text-muted-foreground'}
          role={error ? 'alert' : undefined}
        >
          {error ?? hint}
        </p>
      ) : null}
    </div>
  );
}
