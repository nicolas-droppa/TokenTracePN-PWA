export function canParse(code) {
    parse(code);
}

// private

const KEYWORDS = new Set(['place', 'transition', 'arc']);

function tokenize(src) {
    const tokens = [];
    let i = 0, line = 1, col = 1;
    const punct = {
        '(': 'LPAREN',
        ')': 'RPAREN',
        ':': 'COLON',
        ',': 'COMMA',
        ';': 'SEMI'
    };

    const advance = () => {
        if (src[i] === '\n') { line++; col = 1; }
        else col++;
        i++;
    };

    while (i < src.length) {
        const c = src[i];
        const startLine = line, startCol = col;

        if (/\s/.test(c)) { advance(); continue; }

        if (c === '/' && src[i + 1] === '/') {
            while (i < src.length && src[i] !== '\n') advance();
            continue;
        }

        if (punct[c]) {
            tokens.push({ type: punct[c], value: c, line: startLine, col: startCol });
            advance(); continue;
        }

        if (/[0-9]/.test(c)) {
            let num = '';
            while (i < src.length && /[0-9]/.test(src[i])) { num += src[i]; advance(); }
            tokens.push({ type: 'NUMBER', value: Number(num), line: startLine, col: startCol });
            continue;
        }

        if (/[a-zA-Z_]/.test(c)) {
            let id = '';
            while (i < src.length && /[a-zA-Z0-9_]/.test(src[i])) { id += src[i]; advance(); }
            tokens.push({ type: KEYWORDS.has(id) ? 'KEYWORD' : 'IDENTIFICATOR', value: id, line: startLine, col: startCol });
            continue;
        }

        if (c === '"' || c === "'") {
            const quote = c;
            advance();
            let str = '';
            while (i < src.length && src[i] !== quote) {
                if (src[i] === '\n') throw new Error(`String not closed (line ${startLine}, col ${startCol})`);
                str += src[i]; advance();
            }
            if (i >= src.length) throw new Error(`String not closed (line ${startLine}, col ${startCol})`);
            advance();
            tokens.push({ type: 'STRING', value: str, line: startLine, col: startCol });
            continue;
        }

        throw new Error(`Unknown character '${c}' (line ${line}, col ${col})`);
    }

    tokens.push({ type: 'EOF', value: null, line, col });
    return tokens;
}

function parse(code) {
    const tokens = tokenize(code);
        
    const result = {
        code: code,
        tokens: tokens,
        places: [],
        transitions: [],
        arcs: [],
    };

    let currentSection = null;

    console.log(result);
    return result;
}