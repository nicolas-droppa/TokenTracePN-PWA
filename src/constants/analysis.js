export const ANALYSIS_TASK_STATUS = {
    LOCKED: 'locked',           // still has prerequisites
    TODO: 'todo',               // available but not started
    IN_PROGRESS: 'in-progress', // code differs from template
    SOLVED: 'solved',           // tests passed -> tool unlocked
};
