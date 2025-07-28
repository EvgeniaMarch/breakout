import * as fs from 'node:fs';

const commitMsgPath = process.argv[2];

if (!commitMsgPath) {
  console.error('❌ Не указан путь к сообщению коммита.');
  process.exit(1);
}

let commitMsg = fs.readFileSync(commitMsgPath, 'utf-8').trim();

if (!commitMsg || commitMsg.length === 0) {
  console.error(
    '❌ Сообщение коммита обязательно! Используйте: git commit -m "ваше сообщение"',
  );
  process.exit(1);
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

// Исправляем сообщение
const fixedMsg = fixCommitMessage(commitMsg);

// Проверяем минимальную длину
if (fixedMsg.length < 3) {
  console.error('❌ Сообщение коммита слишком короткое (минимум 3 символа).');
  process.exit(1);
}

// Проверяем, соответствует ли сообщение Conventional Commits
const conventionalPattern = /^(\w+)(?:$$[^)]+$$)?: .+/;
if (!conventionalPattern.test(fixedMsg)) {
  console.warn(
    '⚠️  Сообщение не соответствует Conventional Commits, но будет принято.',
  );
}

// Сохраняем исправленное сообщение обратно в файл
fs.writeFileSync(commitMsgPath, fixedMsg, 'utf-8');

console.log(`✅ Сообщение коммита валидно: "${fixedMsg}"`);
process.exit(0);
