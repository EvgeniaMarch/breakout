import { select, input } from '@inquirer/prompts';
import { execSync } from 'child_process';

async function createInteractiveCommit() {
  const selectedType = await select({
    message: 'Выберите тип коммита:',
    choices: [
      /* ... */
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
