import * as fs from 'node:fs';
import { execSync } from 'node:child_process';
import { select } from '@inquirer/prompts';

// - type: один из разрешённых
// - (scope): опционально
// - : после типа и области
// - описание: обязательно, после двоеточия с пробелом
const conventionalPattern =
  /^(feat|fix|docs|style|refactor|test|chore|perf)(?:\(([^)]+)\))?: (.+)$/;
console.error('🔍 getValidateCommitMessage.js: запущен-1');

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: git commit -m "<message>"
  
Allowed types:
  feat     - Adding new functionality
  fix      - Bug fixes  
  docs     - Documentation updates
  style    - Code style fixes
  refactor - Code refactoring
  test     - Adding tests
  chore    - Maintenance tasks
  perf     - Performance improvements

Format: <type>(<scope>): <description>
Example: feat(auth): add login functionality
  `);
  process.exit(0);
}

console.error('📄 Путь к файлу:', process.argv[2]);

const commitMsgPath = process.argv[2];
console.log('🚀 ~ commitMsgPath:', commitMsgPath);
if (!commitMsgPath) {
  console.error('❌ Не указан путь к сообщению коммита.');
  process.exit(1);
}

let commitMsg = fs.readFileSync(commitMsgPath, 'utf-8').trim();
console.log('🚀 ~ commitMsg:', commitMsg);

if (!commitMsg || commitMsg.length === 0) {
  console.error(
    '❌ Сообщение коммита обязательно! Используйте: git commit -m "ваше сообщение"',
  );
  process.exit(1);
}
const match = commitMsg.match(conventionalPattern);
console.log('🚀 ~ match:-1', match);
const currentBranch = getCurrentBranch();
const commitTypeFromBranch = getTypeFromBranch(currentBranch);
const scopeFromBranch = getScopeFromBranch(currentBranch);

const allowedTypes = [
  'feat',
  'fix',
  'docs',
  'style',
  'refactor',
  'test',
  'chore',
];

// if (!match) {
//   if (commitTypeFromBranch) {
//     const fixedMsg = `${commitTypeFromBranch}(${
//       scopeFromBranch ? scopeFromBranch : 'common'
//     }): ${commitMsg.trim()}`;
//     fs.writeFileSync(commitMsgPath, fixedMsg, 'utf-8');
//     console.log(`✅ Сообщение исправлено: "${fixedMsg}"`);
//     process.exit(0);
//   } else {
//     console.error(
//       '❌ Не удалось определить тип из ветки и сообщение не соответствует формату.',
//     );
//     process.exit(1);
//   }

//   // console.error(
//   //   '❌ Сообщение не соответствует формату <тип>(<область>): <описание>',
//   // );
//   // process.exit(1);
// } else {
//   const [_, type] = match;

//   if (!allowedTypes.includes(type)) {
//     // Тип в сообщении неверный
//     if (commitTypeFromBranch) {
//       console.warn(
//         `⚠️  Недопустимый тип: "${type}". Используем тип из ветки: ${commitTypeFromBranch}`,
//       );

//       const [, scope, description] = match;
//       const finalScope = scope || scopeFromBranch;
//       const fixedMsg = `${commitTypeFromBranch}${
//         finalScope ? `(${finalScope})` : ''
//       }: ${description}`;

//       fs.writeFileSync(commitMsgPath, fixedMsg, 'utf-8');
//       console.log(`✅ Исправлено: "${commitMsg}" → "${fixedMsg}"`);
//       process.exit(0);
//     } else {
//       console.error(
//         '❌ Недопустимый тип и не удалось определить тип из ветки.',
//       );
//       process.exit(1);
//     }
//   }
// }

async function validateCommitMessage() {
  if (!match) {
    if (commitTypeFromBranch) {
      // автоматическое исправление
      const fixedMsg = `${commitTypeFromBranch}(${
        scopeFromBranch || 'common'
      }): ${commitMsg.trim()}`;
      fs.writeFileSync(commitMsgPath, fixedMsg, 'utf-8');
      console.log(`✅ Сообщение исправлено: "${fixedMsg}"`);
      process.exit(0);
    } else {
      console.error(
        '❌ Не удалось определить тип из ветки и сообщение не соответствует формату.',
      );

      try {
        // Перенаправляем stdin для интерактивности
        process.stdin.resume();
        process.stdin.setEncoding('utf8');

        const selectedType = await select({
          message: 'Выберите тип коммита:',
          choices: [
            { name: 'feat - Новая функциональность', value: 'feat' },
            { name: 'fix - Исправление ошибок', value: 'fix' },
            { name: 'docs - Документация', value: 'docs' },
            { name: 'style - Стиль кода', value: 'style' },
            { name: 'refactor - Рефакторинг', value: 'refactor' },
            { name: 'test - Тесты', value: 'test' },
            { name: 'chore - Вспомогательные задачи', value: 'chore' },
            { name: 'perf - Производительность', value: 'perf' },
          ],
        });

        const selectedScope = await input({
          message:
            'Введите область (scope) или нажмите Enter чтобы пропустить:',
          default: scopeFromBranch || 'common',
        });

        const description = await input({
          message: 'Введите описание коммита:',
          default: commitMsg.trim(),
          validate: (value) =>
            value.length > 0 ? true : 'Описание не может быть пустым',
        });

        const finalScope = selectedScope.trim()
          ? `(${selectedScope.trim()})`
          : '';
        const fixedMsg = `${selectedType}${finalScope}: ${description.trim()}`;

        fs.writeFileSync(commitMsgPath, fixedMsg, 'utf-8');
        console.log(`✅ Сообщение создано: "${fixedMsg}"`);
        process.exit(0);
      } catch (error) {
        console.error(
          '❌ Ошибка при интерактивном выборе, используем значение по умолчанию',
        );
        // const fixedMsg = `chore(common): ${commitMsg.trim()}`;
        // fs.writeFileSync(commitMsgPath, fixedMsg, 'utf-8');
        // console.log(`✅ Использовано значение по умолчанию: "${fixedMsg}"`);
        process.exit(0);
      }
    }
  }
}

validateCommitMessage();

function getCurrentBranch() {
  let currentBranch = '';
  try {
    currentBranch = execSync('git branch --show-current', {
      encoding: 'utf-8',
      stdio: 'pipe',
    }).trim();
  } catch (err) {
    console.warn('⚠️ Не удалось определить текущую ветку.');
    currentBranch = 'unknown';
  }
  console.log(`📌 Текущая ветка: ${currentBranch}`);
  return currentBranch;
}

function getTypeFromBranch(branchName) {
  const branchToTypeMap = {
    feature: 'feat',
    feat: 'feat',
    fix: 'fix',
    bug: 'fix',
    hotfix: 'fix',
    doc: 'docs',
    chore: 'chore',
    refactor: 'refactor',
    test: 'test',
    style: 'style',
  };
  for (const [branchPrefix, commitType] of Object.entries(branchToTypeMap)) {
    // Проверяем, начинается ли ветка с префикса (например, feature/, feat/)
    if (
      branchName.startsWith(branchPrefix + '/') ||
      branchName === branchPrefix
    ) {
      return commitType;
    }
  }
  return null;
}

function getScopeFromBranch(branchName) {
  const match = branchName.match(/^[^/]+\/(.+)$/);
  return match ? match[1] : null;
}
