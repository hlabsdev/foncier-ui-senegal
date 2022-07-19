export const environment = {
  production: false,
  api: 'http://dev-sgf-worker01.az.sogema.local:8280',
  workflowApi: 'http://dev-sgf-worker01.az.sogema.local:8581',
  translationApi: 'http://dev-sgf-worker01.az.sogema.local:3200/fasApi',
  version: require('../../package.json').version,
  defaultLanguage: 'fr',
  defaultLocale: 'fr-SN',
  availableLanguages: ['en', 'fr-SN'],
  app: null,
  environment: 'dev-sn'
};
