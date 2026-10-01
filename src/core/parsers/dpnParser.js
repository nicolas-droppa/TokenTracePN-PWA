import { PUNCTUATION, KEYWORDS } from '../../constants/parsers/dpnParser.js';
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
    let num = '';
    while (ctx.i < ctx.src.length && /[0-9]/.test(ctx.src[ctx.i])) {
        num += ctx.src[ctx.i];
        ctx.advance();
    }
    ctx.pushToken({ type: 'NUMBER', value: Number(num), line: startLine, col: startCol });
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
        pushToken(t) { tokens.push(t); }
    };

    while (ctx.i < ctx.src.length) {
        const c = ctx.src[ctx.i];
        const startLine = ctx.line, startCol = ctx.col;

        if (/\s/.test(c)) { ctx.advance(); continue; }

        if (c === '/' && ctx.src[ctx.i + 1] === '/') {
            while (ctx.i < ctx.src.length && ctx.src[ctx.i] !== '\n') ctx.advance();
            continue;
        }

        if (c === '-' && ctx.src[ctx.i + 1] === '>') {
            ctx.pushToken({ type: 'ARROW', value: '->', line: startLine, col: startCol });
            ctx.advance();
            ctx.advance();
            continue;
        }

        if (PUNCTUATION[c]) {
            ctx.pushToken({ type: PUNCTUATION[c], value: c, line: startLine, col: startCol });
            ctx.advance(); continue;
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

        if (t.type === 'IDENTIFICATOR' && tokens[pos + 1] && tokens[pos + 1].type === 'ARROW') {
            const arc = parseArc();
            expect('SEMI');
            return arc;
        }

        const decl = parseDeclaration();
        expect('SEMI');
        return decl;
    }

    function parseArc() {
        const fromToken = expect('IDENTIFICATOR');
        expect('ARROW');
        const toToken = expect('IDENTIFICATOR');
        let attributes = [];
        if (peek().type === 'LPAREN') {
            attributes = parseAttributes();
        }
        return {
            type: 'arc',
            from: fromToken.value,
            to: toToken.value,
            attributes,
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
            let attributes = [];
            if (peek().type === 'LPAREN') {
                attributes = parseAttributes();
            }
            return {
                type: 'declaration',
                keyword: t.value,
                name: nameToken.value,
                attributes,
                line: t.line,
                col: t.col,
                namePos: { line: nameToken.line, col: nameToken.col },
            };
        }

        if (t.type === 'IDENTIFICATOR') {
            const nameToken = advance();
            const attributes = parseAttributes();
            return {
                type: 'configuration',
                name: nameToken.value,
                attributes,
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
        expect('LPAREN');
        const attributes = [];

        if (peek().type !== 'RPAREN') {
            attributes.push(parseAttribute());
            while (peek().type === 'COMMA') {
                advance();
                attributes.push(parseAttribute());
            }
        }

        expect('RPAREN');
        return attributes;
    }

    // attribute = IDENT ":" value
    function parseAttribute() {
        const keyToken = expect('IDENTIFICATOR');
        expect('COLON');
        const value = parseValue();
        return { key: keyToken.value, value, line: keyToken.line, col: keyToken.col };
    }

    // value = STRING | NUMBER
    function parseValue() {
        const t = peek();
        if (t.type === 'STRING' || t.type === 'NUMBER') return advance().value;
        const error = new Error(`Expected value (STRING or NUMBER) but got ${t.type} (line ${t.line}, col ${t.col})`);
        error.line = t.line;
        error.col = t.col;
        throw error;
    }

    return parseProgram();
}