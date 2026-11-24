export const LAB_STATUS = {
    LOCKED: 'locked',           // still has prerequisites
    TODO: 'todo',               // available but not started
    IN_PROGRESS: 'in-progress', // code differs from template
    SOLVED: 'solved',           // tests passed -> tool unlocked
};

/** Translation keys of the statuses (common namespace). */
export const LAB_STATUS_KEYS = {
    [LAB_STATUS.LOCKED]: 'common:labStatus.locked',
    [LAB_STATUS.TODO]: 'common:labStatus.todo',
    [LAB_STATUS.IN_PROGRESS]: 'common:labStatus.inProgress',
    [LAB_STATUS.SOLVED]: 'common:labStatus.solved',
};

export const LAB_TAB = {
    TASK: 'task',
    CODE: 'code',
    REFERENCE: 'reference',
};

export const LAB_TABS = Object.values(LAB_TAB);