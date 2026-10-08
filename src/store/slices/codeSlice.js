const DEFAULT_CODE = `place p1;\nplace p2(l: "P2", m: 5, x:250, y:230);\np1(x:250, y:330);\ntransition t1(x:250, y:280);\nt1 -> p1(w: 2, t: "inhibitor");`;

/**
 * Source code in the editor.
 * @param {Function} set - Zustand set.
 */
export const createCodeSlice = (set) => ({
    code: DEFAULT_CODE,
    language: 'dpn',

    setCode: (code) => set({ code }),

    setLanguage: (language) => set({ language }),
});
