export const environment = {
  production: false,
  api: 'http://pp-ml-fon-worker01.az.sogema.local:8280',
  workflowApi: 'http://pp-ml-fon-worker01.az.sogema.local:8581',
  translationApi: 'http://pp-ml-fon-worker01.az.sogema.local:3200',
  version: require('../../package.json').version,
  defaultLanguage: 'fr',
  defaultLocale: 'fr-ML',
  availableLanguages: ['en', 'fr-ML'],
  app: null,
  environment: 'pp-ml'
};
