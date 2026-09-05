import type { InputHTMLAttributes, LabelHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = "", id, ...rest }: InputProps) {
  return (
    <label className="flex flex-col gap-1 text-sm" htmlFor={id}>
      {label && <span className="font-medium text-gray-700">{label}</span>}
      <input
        id={id}
        className={`rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500 ${className}`}
        {...rest}
      />
    </label>
  );
}

export function TextArea({
  label,
  className = "",
  id,
  ...rest
}: {
  label?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="flex flex-col gap-1 text-sm" htmlFor={id}>
      {label && <span className="font-medium text-gray-700">{label}</span>}
      <textarea
        id={id}
        className={`rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 outline-none focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500 ${className}`}
        {...rest}
      />
    </label>
  );
}

export function FieldLabel({
  children,
  ...rest
}: { children: ReactNode } & LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className="text-sm font-medium text-gray-700" {...rest}>
      {children}
    </label>
  );
}
