import { TRANSLATION_LANGS } from '../../utils/translations';

const fieldClass =
    'w-full rounded-lg border border-line-input bg-white px-3.5 text-[15px] text-ink-900 outline-none focus:border-[1.5px] focus:border-brand-600';

// Колонки RO и RU под основной формой. пустые поля = на сайте будет английский оригинал
function TranslationFields({ idPrefix, value, onChange, nameLabel = 'Name', nameHint, descriptionRows = 2 }) {
    function update(lang, field) {
        return e => onChange({ ...value, [lang]: { ...value[lang], [field]: e.target.value } });
    }

    return (
        <fieldset className="m-0 min-w-0 rounded-[20px] border border-line bg-white p-6">
            <legend className="px-2.5 text-[17px] font-bold">Translations</legend>
            <p className="mb-4 text-[13px] text-ink-400">
                Leave empty to show the English text. {nameHint}
            </p>
            <div className="grid gap-5 md:grid-cols-2">
                {TRANSLATION_LANGS.map(({ code, label }) => (
                    <div key={code} lang={code} className="flex min-w-0 flex-col gap-3">
                        <p className="text-sm font-bold text-brand-600">{label}</p>
                        <p className="flex flex-col gap-[7px]">
                            <label htmlFor={`${idPrefix}-${code}-name`} className="text-sm font-semibold">{nameLabel}</label>
                            <input
                                id={`${idPrefix}-${code}-name`}
                                maxLength={150}
                                value={value[code].name}
                                onChange={update(code, 'name')}
                                className={`${fieldClass} h-11`}
                            />
                        </p>
                        <p className="flex flex-col gap-[7px]">
                            <label htmlFor={`${idPrefix}-${code}-description`} className="text-sm font-semibold">Description</label>
                            <textarea
                                id={`${idPrefix}-${code}-description`}
                                rows={descriptionRows}
                                value={value[code].description}
                                onChange={update(code, 'description')}
                                className={`${fieldClass} resize-y py-2.5`}
                            />
                        </p>
                    </div>
                ))}
            </div>
        </fieldset>
    );
}

export default TranslationFields;
