import { PUNCTUATION, KEYWORDS } from '../../constants/dpn.js';
import { checkSemantics } from './dpnSemantics.js';

export function canParse(code) {
    try {
        const result = parse(code);
        return !(result.errors || []).some((err) => err.severity === 'error');
    } catch (err) {
        return false;
    }
}

function normalizeError(err) {
    const message = err?.message || String(err);
    const match = message.match(/line\s+(\d+),\s*col\s+(\d+)/i);

    const line = Number.isFinite(Number(err?.line)) ? Number(err.line) : match ? Number(match[1]) : undefined;
    const col = Number.isFinite(Number(err?.col)) ? Number(err.col) : match ? Number(match[2]) : undefined;

    return {
        severity: 'error',
        message,
        line,
        col,
    };
}

export function parse(code) {
    const { tokens, errors } = tokenize(code);

    if (errors.length > 0) {
        return {
            model: null,
            errors: errors.map(normalizeError)
        };
    }

    let model;
    try {
        model = parseTokens(tokens);
    } catch (err) {
        return {
            model: null,
            errors: [normalizeError(err)]
        };
    }

    return { model, errors: checkSemantics(model) };
}

export default { canParse, parse };

// private

function handleNumbers(ctx, startLine, startCol) {
    let sign = '';
    if (ctx.src[ctx.i] === '-' && /[0-9]/.test(ctx.src[ctx.i + 1])) {
        sign = '-';
        ctx.advance();
    }

    let num = '';
    while (ctx.i < ctx.src.length && /[0-9]/.test(ctx.src[ctx.i])) {
        num += ctx.src[ctx.i];
        ctx.advance();
    }

    ctx.pushToken({ type: 'NUMBER', value: Number(sign + num), line: startLine, col: startCol });
}

function handleLetters(ctx, startLine, startCol) {
    let id = '';
    while (ctx.i < ctx.src.length && /[a-zA-Z0-9_]/.test(ctx.src[ctx.i])) {
        id += ctx.src[ctx.i];
        ctx.advance();
    }
    ctx.pushToken({ type: KEYWORDS.has(id) ? 'KEYWORD' : 'IDENTIFICATOR', value: id, line: startLine, col: startCol });
}

function handleString(ctx, startLine, startCol, errors) {
    const quote = ctx.src[ctx.i];
    ctx.advance();
    let str = '';

    while (ctx.i < ctx.src.length && ctx.src[ctx.i] !== quote) {
        if (ctx.src[ctx.i] === '\n') {
            errors.push(new Error(`String not closed (line ${startLine}, col ${startCol})`));
        }
        str += ctx.src[ctx.i];
        ctx.advance();
    }

    if (ctx.i >= ctx.src.length) {
        errors.push(new Error(`String not closed (line ${startLine}, col ${startCol})`));
        return;
    }

    ctx.advance();
    ctx.pushToken({ type: 'STRING', value: str, line: startLine, col: startCol });
}

function tokenize(src) {
    const tokens = [];
    const errors = [];
    const ctx = {
        src,
        i: 0,
        line: 1,
        col: 1,
        advance() {
            if (this.src[this.i] === '\n') { this.line++; this.col = 1; }
            else this.col++;
            this.i++;
        },
        tokenStart: 0,
        // start/end = offsets in the source, end = position right after token
        pushToken(t) { tokens.push({ ...t, start: this.tokenStart, end: this.i }); }
    };

    while (ctx.i < ctx.src.length) {
        const c = ctx.src[ctx.i];
        const startLine = ctx.line, startCol = ctx.col;
        ctx.tokenStart = ctx.i;

        if (/\s/.test(c)) { ctx.advance(); continue; }

        if (c === '/' && ctx.src[ctx.i + 1] === '/') {
            while (ctx.i < ctx.src.length && ctx.src[ctx.i] !== '\n') ctx.advance();
            continue;
        }

        if (c === '-' && ctx.src[ctx.i + 1] === '>') {
            ctx.advance();
            ctx.advance();
            ctx.pushToken({ type: 'ARROW', value: '->', line: startLine, col: startCol });
            continue;
        }

        if (PUNCTUATION[c]) {
            ctx.advance();
            ctx.pushToken({ type: PUNCTUATION[c], value: c, line: startLine, col: startCol });
            continue;
        }

        if (c === '-' && /[0-9]/.test(ctx.src[ctx.i + 1])) {
            handleNumbers(ctx, startLine, startCol);
            continue;
        }

        if (/[0-9]/.test(c)) {
            handleNumbers(ctx, startLine, startCol);
            continue;
        }

        if (/[a-zA-Z_]/.test(c)) {
            handleLetters(ctx, startLine, startCol);
            continue;
        }

        if (c === '"' || c === "'") {
            handleString(ctx, startLine, startCol, errors);
            continue;
        }

        errors.push(new Error(`Unknown character '${c}' (line ${ctx.line}, col ${ctx.col})`));
        ctx.advance();
    }

    ctx.tokenStart = ctx.i;
    ctx.pushToken({ type: 'EOF', value: null, line: ctx.line, col: ctx.col });
    return { tokens, errors };
}

function parseTokens(tokens) {
    let pos = 0;

    const peek = () => tokens[pos] || { type: 'EOF', value: null, line: 0, col: 0 };
    const advance = () => tokens[pos++];
    const expect = (type) => {
        const t = peek();
        if (t.type !== type) {
            const error = new Error(`Expected ${type} but got ${t.type} (line ${t.line}, col ${t.col})`);
            error.line = t.line;
            error.col = t.col;
            throw error;
        }
        return advance();
    };

    // program = statement* EOF
    function parseProgram() {
        const statements = [];
        while (peek().type !== 'EOF') {
            statements.push(parseStatement());
        }
        return { type: 'program', statements };
    }

    // statement = arc ";" | declaration ";"
    function parseStatement() {
        const t = peek();
        const isArc = t.type === 'IDENTIFICATOR' && tokens[pos + 1] && tokens[pos + 1].type === 'ARROW';

        const statement = isArc ? parseArc() : parseDeclaration();
        const semi = expect('SEMI');
        return { ...statement, start: t.start, end: semi.end };
    }

    function parseArc() {
        const fromToken = expect('IDENTIFICATOR');
        expect('ARROW');
        const toToken = expect('IDENTIFICATOR');
        const list = peek().type === 'LPAREN' ? parseAttributes() : null;
        return {
            type: 'arc',
            from: fromToken.value,
            to: toToken.value,
            attributes: list?.attributes ?? [],
            attributeList: list && { start: list.start, end: list.end },
            headerEnd: toToken.end,
            line: fromToken.line,
            col: fromToken.col,
            fromPos: { line: fromToken.line, col: fromToken.col },
            toPos: { line: toToken.line, col: toToken.col },
        };
    }

    // declaration = KEYWORD IDENT attributes? | IDENT attributes
    function parseDeclaration() {
        const t = peek();

        if (t.type === 'KEYWORD') {
            advance();
            const nameToken = expect('IDENTIFICATOR');
            const list = peek().type === 'LPAREN' ? parseAttributes() : null;
            return {
                type: 'declaration',
                keyword: t.value,
                name: nameToken.value,
                attributes: list?.attributes ?? [],
                attributeList: list && { start: list.start, end: list.end },
                headerEnd: nameToken.end,
                line: t.line,
                col: t.col,
                namePos: { line: nameToken.line, col: nameToken.col },
            };
        }

        if (t.type === 'IDENTIFICATOR') {
            const nameToken = advance();
            const list = parseAttributes();
            return {
                type: 'configuration',
                name: nameToken.value,
                attributes: list.attributes,
                attributeList: { start: list.start, end: list.end },
                headerEnd: nameToken.end,
                line: t.line,
                col: t.col,
                namePos: { line: nameToken.line, col: nameToken.col },
            };
        }

        const error = new Error(`Expected declaration but got ${t.type} (line ${t.line}, col ${t.col})`);
        error.line = t.line;
        error.col = t.col;
        throw error;
    }

    // attributes = "(" attribute ("," attribute)* ")"
    function parseAttributes() {
        const lparen = expect('LPAREN');
        const attributes = [];

        if (peek().type !== 'RPAREN') {
            attributes.push(parseAttribute());
            while (peek().type === 'COMMA') {
                advance();
                attributes.push(parseAttribute());
            }
        }

        const rparen = expect('RPAREN');
        return { attributes, start: lparen.start, end: rparen.end };
    }

    // attribute = IDENT ":" value
    function parseAttribute() {
        const keyToken = expect('IDENTIFICATOR');
        expect('COLON');
        const valueToken = parseValue();
        return {
            key: keyToken.value,
            value: valueToken.value,
            line: keyToken.line,
            col: keyToken.col,
            start: keyToken.start,
            end: valueToken.end,
            valueStart: valueToken.start,
        };
    }

    // value = STRING | NUMBER
    function parseValue() {
        const t = peek();
        if (t.type === 'STRING' || t.type === 'NUMBER') return advance();
        const error = new Error(`Expected value (STRING or NUMBER) but got ${t.type} (line ${t.line}, col ${t.col})`);
        error.line = t.line;
        error.col = t.col;
        throw error;
    }

    return parseProgram();
}
