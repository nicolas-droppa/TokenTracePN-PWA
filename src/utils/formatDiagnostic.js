import { DIAGNOSTIC } from '../constants/diagnostics';

/**
 * Turns a diagnostic from core ({ code, params }) into a translated message.
 * Identifier params (token types, value types, arc types) are translated first,
 * names and numbers stay as they are. Node kind (and arc type for direction errors)
 * picks the sentence variant via i18next context, so grammar (gender) can differ.
 * @param {{ code?: string, params?: Object, message?: string }} diagnostic
 * @param {Function} t - i18next t (from useTranslation or i18n.t).
 * @returns {string}
 */
export const formatDiagnostic = (diagnostic, t) => {
    if (!diagnostic?.code) return diagnostic?.message ?? String(diagnostic);

    const { code } = diagnostic;
    const raw = diagnostic.params ?? {};
    const params = { ...raw };

    const token = (type) => t(`diagnostics:tokens.${type}`, { defaultValue: type });
    const arcType = (type) => t(`common:arcTypes.${type}`, { defaultValue: type }).toLocaleLowerCase();

    if (code === DIAGNOSTIC.UNEXPECTED_TOKEN) params.expected = token(raw.expected);
    if (code === DIAGNOSTIC.INVALID_ATTRIBUTE_TYPE) {
        params.expected = t(`diagnostics:valueTypes.${raw.expected}`, { defaultValue: raw.expected });
    }
    if (raw.found) params.found = token(raw.found);
    if (raw.type) params.type = arcType(raw.type);
    if (raw.firstType) params.firstType = arcType(raw.firstType);
    if (Array.isArray(raw.options)) params.options = raw.options.join(', ');

    const context = code === DIAGNOSTIC.SPECIAL_ARC_DIRECTION ? raw.type : raw.kind;
    const key = raw.suggestion ? `${code}Suggestion` : code;

    return t(`diagnostics:${key}`, { ...params, context });
};
