import validation from './e2e.validation.config.ts';
export default { ...validation, projectId: 'allure-failure-evidence-validation', tests: ['validation/allure-failure.e2e.ts'] };
