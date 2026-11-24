const stripWrappingQuotes = (value) => value.replace(/^(['"])(.*)\1$/, '$2');

export const parseFrontmatter = (raw) => {
    const normalized = raw.replace(/^\uFEFF/, '');
    const match = /^---\r?\n([\s\S]*?)\r?\n?---(?:\r?\n|$)([\s\S]*)$/.exec(normalized);

    if (!match) {
        return { meta: {}, body: normalized };
    }

    const entries = match[1]
        .split(/\r?\n/)
        .map((line) => {
            const colonIndex = line.indexOf(':');
            if (colonIndex === -1) {
                return null;
            }
            const key = line.slice(0, colonIndex).trim();
            if (!key) {
                return null;
            }
            const rawValue = line.slice(colonIndex + 1).trim();
            return [key, stripWrappingQuotes(rawValue)];
        })
        .filter(Boolean);

    return {
        meta: Object.fromEntries(entries),
        body: match[2] ?? '',
    };
};
