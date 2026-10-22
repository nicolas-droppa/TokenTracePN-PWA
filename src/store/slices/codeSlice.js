const DEFAULT_CODE = `// Lone worker
place idle (l: "Idle", m: 1, x: 120, y: 200);
place busy (l: "Busy", x: 400, y: 200);
transition start (x: 260, y: 110);
transition finish (x: 260, y: 290);

idle -> start;
start -> busy;
busy -> finish;
finish -> idle;
`;

/**
 * Source code in the editor.
 * @param {Function} set - Zustand set.
 */
export const createCodeSlice = (set) => ({
    code: DEFAULT_CODE,
    language: 'dpn',
    codeHasErrors: false,

    setCode: (code) => set({ code }),

    setLanguage: (language) => set({ language }),

    setCodeHasErrors: (codeHasErrors) => set({ codeHasErrors }),
});
