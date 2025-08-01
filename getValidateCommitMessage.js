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
console.log('🚀 ~ match:', match);

// if (match) {
//   let [_, type, scope, description] = match;
//   const allowedTypes = [
//     'feat',
//     'fix',
//     'docs',
//     'style',
//     'refactor',
//     'test',
//     'chore',
//   ];
//   const currentBranch = getCurrentBranch();

//   const branchTypeMatch = currentBranch.match(
//     /^(feat|fix|docs|style|refactor|test|chore)\b/,
//   );

//   if (!allowedTypes.includes(type)) {
//     console.warn(
//       `⚠️  Недопустимый тип коммита: "${type}". Должен быть один из: ${allowedTypes.join(
//         ', ',
//       )}`,
//     );

//     // Извлекаем тип из ветки
//     if (branchTypeMatch) {
//       const branchType = branchTypeMatch[1];
//       console.log(`🔧 Извлечён тип из ветки "${currentBranch}": ${branchType}`);

//       // Формируем новое сообщение с правильным типом
//       finalMsg = `${branchType}${scope ? `(${scope})` : ''}: ${description}`;

//       console.log(`📝 Автоисправление: "${fixedMsg}" → "${finalMsg}"`);
//     }
//   }
//   if (description[0] !== description[0].toLowerCase()) {
//     console.warn('⚠️  Описание должно начинаться с маленькой буквы.');
//     // process.exit(1);
//     finalMsg = commitMsg.charAt(0).toLowerCase() + commitMsg.slice(1);
//   }

//   if (description.endsWith('.')) {
//     console.warn('⚠️  Описание не должно заканчиваться точкой.');
//     // process.exit(1);
//     finalMsg += '.';
//   }
//   console.log(`✅ Сообщение коммита валидно: "${fixedMsg}"`);
//   process.exit(0);
// }

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
