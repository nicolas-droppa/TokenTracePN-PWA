import { useTranslation } from 'react-i18next';
import { getLabText } from '../labs/labRegistry';

export const useLabText = (lab) => {
    const { i18n } = useTranslation();
    return getLabText(lab, i18n.language);
};
