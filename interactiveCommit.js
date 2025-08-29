import { select, input } from '@inquirer/prompts';
import { execSync } from 'child_process';

async function createInteractiveCommit() {
  const selectedType = await select({
    message: 'Выберите тип коммита:',
    choices: [
      {
        name: 'build',
        value: 'build',
        description: 'Build project or external dependencies changes',
      },
      {
        name: 'ci',
        value: 'ci',
        description: 'CI configuration and scripts work',
      },
      {
        name: 'docs',
        value: 'docs',
        description: 'Documentation updates',
      },
      {
        name: 'feat',
        value: 'feat',
        description: 'Adding new functionality',
      },
      {
        name: 'fix',
        value: 'fix',
        description: 'Bug fixes',
      },
      {
        name: 'perf',
        value: 'perf',
        description: 'Performance improvements',
      },
      {
        name: 'refactor',
        value: 'refactor',
        description: 'Code changes without fixing bugs or adding new features',
      },
      {
        name: 'revert',
        value: 'revert',
        description: 'Revert to previous commits',
      },
      {
        name: 'style',
        value: 'style',
        description: 'Code style fixes (tabs, indents, dots, commas, etc.)',
      },
      {
        name: 'test',
        value: 'test',
        description: 'Adding tests',
      },
    ],
  });

  const selectedScope = await input({
    message: 'Введите область (scope):',
    default: 'common',
  });

  const description = await input({
    message: 'Введите описание коммита:',
    validate: (value) =>
      value.length > 0 ? true : 'Описание не может быть пустым',
  });

  const commitMessage = `${selectedType}(${selectedScope}): ${description}`;

  // Выполняем коммит
  execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
}

createInteractiveCommit().catch(console.error);
