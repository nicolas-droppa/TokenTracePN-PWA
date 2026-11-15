import { parse } from './dpnParser.js';
import { buildNet } from './dpnBuilder.js';

export function netFromCode(code) {
    const { model, errors } = parse(code);
    const hasErrors = !model || errors.some((err) => err.severity === 'error');

    if (hasErrors) {
        return { net: null, diagnostics: errors ?? [] };
    }

    return { net: buildNet(model), diagnostics: errors ?? [] };
}
