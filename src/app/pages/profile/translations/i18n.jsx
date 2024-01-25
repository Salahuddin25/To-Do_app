import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        jobTitle: 'Job Title',
        back: 'Back',
        loading: 'Loading...',
      },
    },
    fr: {
      translation: {
        firstName: 'Prénom',
        lastName: 'Nom de famille',
        email: 'E-mail',
        jobTitle: 'Titre du poste',
        back: 'Retour',
        loading: 'Chargement...',
      },
    },
  },
  lng: 'en', 
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;