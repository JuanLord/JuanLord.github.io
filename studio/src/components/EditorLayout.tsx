import { Plus, Trash2 } from "lucide-react";
import type { ReactNode } from "react";

interface EditorLayoutProps<T> {
  title: string;
  eyebrow: string;
  items: T[];
  selectedKey?: string;
  getKey: (item: T) => string;
  getTitle: (item: T) => string;
  getMeta: (item: T) => string;
  onSelect: (key: string) => void;
  onAdd: () => void;
  onDelete?: () => void;
  children: ReactNode;
}

export function EditorLayout<T>({
  title,
  eyebrow,
  items,
  selectedKey,
  getKey,
  getTitle,
  getMeta,
  onSelect,
  onAdd,
  onDelete,
  children,
}: EditorLayoutProps<T>) {
  return (
    <section className="editor-page">
      <header className="page-heading">
        <div>
          <p>{eyebrow}</p>
          <h1>{title}</h1>
        </div>
        <button className="button button-primary" type="button" onClick={onAdd}>
          <Plus size={17} aria-hidden="true" />
          New
        </button>
      </header>

      <div className="editor-workspace">
        <aside className="record-list" aria-label={`${title} records`}>
          <p className="record-count">{items.length} records</p>
          {items.map((item) => {
            const key = getKey(item);
            return (
              <button
                key={key}
                type="button"
                className={
                  key === selectedKey ? "record-row active" : "record-row"
                }
                onClick={() => onSelect(key)}
              >
                <strong>{getTitle(item) || "Untitled"}</strong>
                <span>{getMeta(item)}</span>
              </button>
            );
          })}
        </aside>

        <div className="record-editor">
          {children}
          {selectedKey && onDelete ? (
            <footer className="record-actions">
              <button
                className="button button-danger"
                type="button"
                onClick={onDelete}
              >
                <Trash2 size={16} aria-hidden="true" />
                Delete record
              </button>
            </footer>
          ) : null}
        </div>
      </div>
    </section>
  );
}
