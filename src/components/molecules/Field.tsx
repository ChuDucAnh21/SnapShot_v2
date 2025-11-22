import * as React from 'react';

export type FieldRenderProps = {
  'id': string;
  'name': string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
};

export type FieldProps = {
  label: string;
  name: string;
  hint?: string;
  error?: string;
  /**
   * Render-prop: you must render the control and spread these props onto it.
   * Example:
   *   <Field ...>{(props) => <input {...props} />}</Field>
   */
  children: (controlProps: FieldRenderProps) => React.ReactElement;
} & React.HTMLAttributes<HTMLDivElement>;

export default function Field({ label, name, hint, error, children, className, ...rest }: FieldProps) {
  const baseId = React.useId(); // unique per Field
  const inputId = `${baseId}-control`;
  const hintId = `${baseId}-hint`;
  const errorId = `${baseId}-error`;

  const describedBy
    = [error ? errorId : undefined, hint && !error ? hintId : undefined].filter(Boolean).join(' ') || undefined;

  const control = children({
    'id': inputId,
    name,
    'aria-describedby': describedBy,
    'aria-invalid': Boolean(error),
  });

  return (
    <div className={['grid gap-1', className].filter(Boolean).join(' ')} {...rest}>
      <label htmlFor={inputId} className="text-sm text-[--foreground]">
        {label}
      </label>

      {control}

      {error && (
        <div id={errorId} className="text-xs text-[--color-danger]">
          {error}
        </div>
      )}

      {hint && !error && (
        <div id={hintId} className="text-xs text-[--muted]">
          {hint}
        </div>
      )}
    </div>
  );
}
