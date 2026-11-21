import React, { useRef, useState } from 'react';
import { useLabStore, selectLabStatus, missingRequirements } from '../../store/useLabStore';
import { useDebouncedCallback } from '../../hooks/useDebouncedCallback';
import { LabTabs } from './components/LabTabs';
import { LabHeader } from './components/LabHeader';
import { LabDescription } from './components/LabDescription';
import { LabCodeEditor } from './components/LabCodeEditor';
import { LabReference } from './components/LabReference';
import { LabLockedState } from './components/LabLockedState';
import { LAB_STATUS, LAB_TAB } from '../../constants/labs';

const SAVE_DELAY_MS = 300;

/**
 * Content of the lab panel for one lab (remounted via key when the lab changes).
 * @param {Object} props
 * @param {Object} props.lab - Lab from the registry.
 */
export const LabView = ({ lab }) => {
    
    const [activeTab, setActiveTab] = useState(LAB_TAB.TASK);
    const editorRef = useRef(null);

    const status = useLabStore(selectLabStatus(lab));
    const solvedLabs = useLabStore((s) => s.solvedLabs);
    const savedCode = useLabStore((s) => s.codeByLab[lab.id]);
    const setLabCode = useLabStore((s) => s.setLabCode);
    const resetLab = useLabStore((s) => s.resetLab);

    const isLocked = status === LAB_STATUS.LOCKED;
    const isSolved = status === LAB_STATUS.SOLVED;
    const missing = isLocked ? missingRequirements(lab, solvedLabs) : [];

    // Typing is saved after a short pause, not on every key
    const saveCode = useDebouncedCallback((nextCode) => setLabCode(lab.id, nextCode), SAVE_DELAY_MS);

    const handleReset = () => {
        saveCode.cancel();
        resetLab(lab.id);
        editorRef.current?.setCode(lab.template ?? ''); // stays undoable with Ctrl+Z
    };

    const show = (tab) => (activeTab === tab ? 'h-full' : 'hidden');

    return (
        <div className="flex h-full min-h-0 flex-col">
            <LabHeader
                lab={lab}
                status={status}
                isLocked={isLocked}
                missingRequirements={missing}
                onReset={handleReset}
            />
            <LabTabs activeTab={activeTab} onChange={setActiveTab} />

            {/* Tabs stay mounted, so the editor keeps its undo history */}
            <div className="relative min-h-0 flex-1 overflow-hidden">
                <div className={show(LAB_TAB.TASK)}>
                    <LabDescription lab={lab} />
                </div>

                <div className={show(LAB_TAB.CODE)}>
                    {isLocked ? (
                        <LabLockedState tab="code" missingRequirements={missing} />
                    ) : (
                        <LabCodeEditor
                            ref={editorRef}
                            initialCode={savedCode ?? lab.template ?? ''}
                            onChange={saveCode}
                        />
                    )}
                </div>

                <div className={show(LAB_TAB.REFERENCE)}>
                    {isLocked ? (
                        <LabLockedState tab="reference" missingRequirements={missing} />
                    ) : (
                        <LabReference lab={lab} isSolved={isSolved} />
                    )}
                </div>
            </div>
        </div>
    );
};
