import * as fs from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// - type: один из разрешённых
// - (scope): опционально
// - : после типа и области
// - описание: обязательно, после двоеточия с пробелом
const conventionalPattern =
  /^(feat|fix|docs|style|refactor|test|chore|perf)(?:$$([^)]+)$$)?: (.+)$/;

const commitMsgPath = process.argv[2];
console.log('🚀 ~ process.argv:', process.argv);

if (!commitMsgPath) {
  console.error('❌ Не указан путь к сообщению коммита.');
  process.exit(1);
}

// let currentBranch = '';
// try {
//   currentBranch = execSync('git branch --show-current', {
//     encoding: 'utf-8',
//     stdio: 'pipe',
//   }).trim();
// } catch (err) {
//   console.warn('⚠️ Не удалось определить текущую ветку.');
//   currentBranch = 'unknown';
// }
// console.log(`📌 Текущая ветка: ${currentBranch}`);
let currentBranch = 'unknown';
try {
  const gitRoot = execSync('git rev-parse --show-toplevel', {
    encoding: 'utf-8',
  }).trim();
  currentBranch = execSync('git rev-parse --abbrev-ref HEAD', {
    cwd: gitRoot,
    encoding: 'utf-8',
  }).trim();
} catch (err) {
  console.warn('⚠️ Ошибка при определении ветки:', err.message);
}
console.log(`📌 Текущая ветка: ${currentBranch}`);

let commitMsg = fs.readFileSync(commitMsgPath, 'utf-8').trim();
// Исправляем сообщение
let fixedMsg = fixCommitMessage(commitMsg);

if (!commitMsg || commitMsg.length === 0) {
  console.error(
    '❌ Сообщение коммита обязательно! Используйте: git commit -m "ваше сообщение"',
  );
  process.exit(1);
}
const match = fixedMsg.match(conventionalPattern);
console.log('🚀 ~ match:', match);

if (!match) {
  console.warn(
    '⚠️  Сообщение не соответствует формату <тип>(<область>): <описание>',
  );
  // process.exit(1);
  // let [_, type, scope, description] = match;

  const allowedTypes = [
    'feat',
    'fix',
    'docs',
    'style',
    'refactor',
    'test',
    'chore',
  ];
  const branchTypeMatch = currentBranch.match(
    /^(feat|fix|docs|style|refactor|test|chore)\b/,
  );

  // if (!allowedTypes.includes(type)) {
  //   console.warn(
  //     `⚠️  Недопустимый тип коммита: "${type}". Должен быть один из: ${allowedTypes.join(
  //       ', ',
  //     )}`,
  //   );
  // Извлекаем тип из ветки
  if (branchTypeMatch) {
    const branchType = branchTypeMatch[1];
    console.log(`🔧 Извлечён тип из ветки "${currentBranch}": ${branchType}`);

    // Формируем новое сообщение с правильным типом
    finalMsg = `${branchType}${scope ? `(${scope})` : ''}: ${description}`;

    console.log(`📝 Автоисправление: "${fixedMsg}" → "${finalMsg}"`);
  }
  // }
  // if (description[0] !== description[0].toLowerCase()) {
  //   console.warn('⚠️  Описание должно начинаться с маленькой буквы.');
  //   // process.exit(1);
  //   finalMsg = commitMsg.charAt(0).toLowerCase() + commitMsg.slice(1);
  // }

  // if (description.endsWith('.')) {
  //   console.warn('⚠️  Описание не должно заканчиваться точкой.');
  //   // process.exit(1);
  //   finalMsg += '.';
  // }
}

// Попытка исправить формат
function fixCommitMessage(msg) {
  // Если формат типа(область) текст - преобразуем в тип(область): текст
  const pattern = /^(\w+(?:$$[^)]+$$))\s+(.+)$/;
  const match = msg.match(pattern);

  if (match) {
    return `${match[1]}: ${match[2]}`;
  }

  // Если формат типа текст - преобразуем в тип: текст
  const simplePattern = /^(\w+)\s+(.+)$/;
  const simpleMatch = msg.match(simplePattern);

  if (simpleMatch) {
    return `${simpleMatch[1]}: ${simpleMatch[2]}`;
  }

  return msg;
}

// Проверяем минимальную длину
if (fixedMsg.length < 3) {
  console.error('❌ Сообщение коммита слишком короткое (минимум 3 символа).');
  finalMsg += '567';
  // process.exit(1);
}

// Проверяем, соответствует ли сообщение Conventional Commits
// const conventionalPattern = /^(\w+)(?:$$[^)]+$$)?: .+/;
// if (!conventionalPattern.test(fixedMsg)) {
//   console.warn(
//     '⚠️  Сообщение не соответствует Conventional Commits, но будет принято.',
//   );
// }
// --- Дополнительная логика на основе ветки (пример) ---
// if (currentBranch.startsWith('fix/') && !fixedMsg.startsWith('fix:')) {
//   console.error('❌ В ветке fix/* сообщение должно начинаться с "fix:"');
//   process.exit(1);
// }

// if (currentBranch.startsWith('feat/') && !fixedMsg.startsWith('feat:')) {
//   console.error('❌ В ветке feat/* сообщение должно начинаться с "feat:"');
//   process.exit(1);
// }

// Сохраняем исправленное сообщение обратно в файл
fs.writeFileSync(commitMsgPath, fixedMsg, 'utf-8');

console.log(`✅ Сообщение коммита валидно: "${fixedMsg}"`);
process.exit(0);
