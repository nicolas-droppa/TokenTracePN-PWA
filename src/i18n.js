import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { useSettingsStore } from './store/useSettingsStore';
import { DEFAULT_LANGUAGE } from './constants/languages';

// './locales/sk/common.json' -> resources.sk.common
const files = import.meta.glob('./locales/*/*.json', { eager: true, import: 'default' });
const resources = {};
for (const [path, content] of Object.entries(files)) {
    const [, , lang, file] = path.split('/');
    resources[lang] ??= {};
    resources[lang][file.replace('.json', '')] = content;
}

i18n.use(initReactI18next).init({
    resources,
    lng: useSettingsStore.getState().language,
    fallbackLng: { cs: ['sk', 'en'], default: ['en'] },
    ns: Object.keys(resources[DEFAULT_LANGUAGE] ?? {}),
    defaultNS: 'common',
    interpolation: { escapeValue: false },
});

document.documentElement.lang = i18n.language;

// Keep i18next and <html lang> in sync with the settings store
useSettingsStore.subscribe((state, previous) => {
    if (state.language === previous.language) return;
    i18n.changeLanguage(state.language);
    document.documentElement.lang = state.language;
});

export default i18n;