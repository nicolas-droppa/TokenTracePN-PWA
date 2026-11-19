import { linter } from '@codemirror/lint';
import * as dpnParser from '../../../core/parsers/dpnParser';
import { DIAGNOSTIC } from '../../../constants/diagnostics';
import { formatDiagnostic } from '../../../utils/formatDiagnostic';
import i18n from '../../../i18n';

/** 
 * Linter for DPN code using the dpnParser.
* @returns {Extension} CodeMirror linter extension for DPN code.
*/
export const dpnLinter = linter(
    (view) => {
        const doc = view.state.doc;
        let errors = [];

        try {
            errors = dpnParser.parse(doc.toString())?.errors || [];
        } catch (err) {
            errors = [{ severity: 'error', code: DIAGNOSTIC.UNKNOWN_ERROR, params: { details: String(err) }, line: 1, col: 1 }];
        }

        return errors.map((err) => {
            const lineNo = Math.min(Math.max(Number(err.line) || 1, 1), doc.lines);
            const line = doc.line(lineNo);
            const from = Math.min(line.from + Math.max((Number(err.col) || 1) - 1, 0), line.to);
            const word = view.state.wordAt(from);
            const to = word ? word.to : Math.min(from + 1, line.to);

            return {
                from,
                to: Math.max(to, from),
                severity: err.severity,
                message: formatDiagnostic(err, i18n.t),
            };
        });
    },
    { delay: 450 }
);
