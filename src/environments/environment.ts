// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  // authurl: 'http://localhost:8090/v1',
  authurl: 'https://p-user-api-dev.quabbly.com/v1',
  mailBaseUrl: 'https://p-user-api-dev.quabbly.com/v1/mail',
  baseUrl: 'https://p-frontend-dev.quabbly.com/v1',
  fileManagerUrl: 'https://p-file-manager-api-dev.quabbly.com/v1',
  hrUrl: 'https://p-hr-api-dev.quabbly.com/v1',
  accountingUrl: 'https://p-accounting-api-dev.quabbly.com/v1',
  taskManagerUrl: 'https://p-task-manager-api-dev.quabbly.com/v1',
  userManagementUrl: 'https://p-user-api-dev.quabbly.com/v1',
  notificationManagementUrl: 'https://p-notification-api-dev.quabbly.com/v1',
  quizUrl: 'https://p-quiz-api-dev.quabbly.com/api/v1',
  omsUrl: 'https://p-order-management-api-dev.quabbly.com/v1'
};
