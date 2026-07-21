import type { ReactNode } from "react";
import type {
  ContentStatus,
  Coordinates,
  CreativeEmbed,
  CreativeEmbedProvider,
} from "../../../src/types/content";
import { normalizeEmbed } from "../lib/studio";

interface FieldProps {
  label: string;
  hint?: string;
  children: ReactNode;
  span?: "full";
}

export function Field({ label, hint, children, span }: FieldProps) {
  return (
    <label
      className={span === "full" ? "studio-field field-full" : "studio-field"}
    >
      <span className="field-label">{label}</span>
      {children}
      {hint ? <span className="field-hint">{hint}</span> : null}
    </label>
  );
}

interface TextFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: "text" | "number" | "month" | "date" | "url";
  placeholder?: string;
  required?: boolean;
  min?: number;
  step?: number;
  span?: "full";
}

export function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  min,
  step,
  span,
}: TextFieldProps) {
  return (
    <Field label={label} span={span}>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        placeholder={placeholder}
        required={required}
        min={min}
        step={step}
      />
    </Field>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <Field label={label} span="full">
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
      />
    </Field>
  );
}

export function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: readonly { value: T; label: string }[];
}) {
  return (
    <Field label={label}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function StatusField({
  value,
  onChange,
}: {
  value: ContentStatus;
  onChange: (value: ContentStatus) => void;
}) {
  return (
    <SelectField
      label="Content status"
      value={value}
      onChange={onChange}
      options={[
        { value: "mock", label: "Mock" },
        { value: "draft", label: "Draft" },
        { value: "published", label: "Published" },
      ]}
    />
  );
}

export function CoordinateFields({
  value,
  onChange,
}: {
  value: Coordinates;
  onChange: (value: Coordinates) => void;
}) {
  return (
    <>
      <TextField
        label="Longitude"
        type="number"
        step={0.000001}
        value={value[0]}
        onChange={(next) => onChange([Number(next), value[1]])}
      />
      <TextField
        label="Latitude"
        type="number"
        step={0.000001}
        value={value[1]}
        onChange={(next) => onChange([value[0], Number(next)])}
      />
    </>
  );
}

export function EmbedField({
  embed,
  provider,
  title,
  onChange,
}: {
  embed: CreativeEmbed;
  provider: CreativeEmbedProvider;
  title: string;
  onChange: (value: CreativeEmbed) => void;
}) {
  const sourceUrl = embed.sourceUrl || "";

  return (
    <Field
      label={`${provider[0].toUpperCase()}${provider.slice(1)} URL`}
      hint={
        sourceUrl
          ? embed.placeholder
            ? "URL is saved but not recognized as an embeddable public link."
            : "Embed ready"
          : "Optional"
      }
      span="full"
    >
      <input
        type="url"
        value={sourceUrl}
        placeholder={`https://${provider === "spotify" ? "open.spotify.com" : provider === "strava" ? "www.strava.com" : provider + ".com"}/...`}
        onChange={(event) =>
          onChange(normalizeEmbed(provider, event.target.value, title))
        }
      />
    </Field>
  );
}
