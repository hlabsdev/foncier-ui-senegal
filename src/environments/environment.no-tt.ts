export const environment = {
  production: false,
  api: 'http://localhost:8280',
  workflowApi: 'http://localhost:8581',
  translationApi: 'http://localhost:3200',
  version: require('../../package.json').version,
  defaultLanguage: 'fr',
  defaultLocale: 'fr-SN',
  availableLanguages: ['en', 'fr-SN'],
  app: null,
  environment: 'no-tt'
};
