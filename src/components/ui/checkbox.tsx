import { useId, type InputHTMLAttributes } from 'react';

export type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  description?: string;
};

export function Checkbox({ label, description, id, className, ...props }: CheckboxProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const descriptionId = `${fieldId}-description`;

  return (
    <div className="flex items-start gap-3">
      <input
        id={fieldId}
        type="checkbox"
        aria-describedby={description ? descriptionId : undefined}
        className={[
          'mt-1 h-5 w-5 rounded border border-input text-primary focus-visible:ring-2 focus-visible:ring-ring',
          className ?? '',
        ].join(' ')}
        {...props}
      />
      {label || description ? (
        <div className="space-y-0.5">
          {label ? (
            <label htmlFor={fieldId} className="block text-sm font-medium text-foreground">
              {label}
            </label>
          ) : null}
          {description ? (
            <p id={descriptionId} className="text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
