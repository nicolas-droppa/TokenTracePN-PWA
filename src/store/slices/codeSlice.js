const DEFAULT_CODE = `// Lone worker
place idle (l: "Idle", m: 1, x: 1, y: 2);
place busy (l: "Busy", x: 5, y: 2);
transition start (x: 3, y: 3);
transition finish (x: 3, y: 1);

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
