import { Pencil, Trash2 } from 'lucide-react';

// Кнопки «изменить / удалить» в строке админ-таблицы
function RowActions({ name, onEdit, onDelete }) {
    return (
        <span className="flex justify-end gap-1">
            <button
                type="button"
                onClick={onEdit}
                aria-label={`Edit ${name}`}
                className="rounded-lg p-2 text-ink-400 hover:bg-surface-50 hover:text-brand-600"
            >
                <Pencil size={16} strokeWidth={1.8} />
            </button>
            <button
                type="button"
                onClick={onDelete}
                aria-label={`Delete ${name}`}
                className="rounded-lg p-2 text-ink-400 hover:bg-surface-50 hover:text-danger"
            >
                <Trash2 size={16} strokeWidth={1.8} />
            </button>
        </span>
    );
}

export default RowActions;
