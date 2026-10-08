import React from 'react';
import { usePetriStore } from '../../../store/usePetriStore';
import { CodeEditorPanel } from '../../panels/CodeEditorPanel';

export const CodePanel = () => {
    const code = usePetriStore((s) => s.code);
    const setCode = usePetriStore((s) => s.setCode);
    const language = usePetriStore((s) => s.language);
    const setLanguage = usePetriStore((s) => s.setLanguage);

    return (
        <div className="h-full w-full overflow-hidden">
            <CodeEditorPanel code={code} setCode={setCode} language={language} setLanguage={setLanguage} />
        </div>
    );
};
