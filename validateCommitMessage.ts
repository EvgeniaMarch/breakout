import fs from 'fs';

const commitMsgPath = process.argv[2];
console.log('🚀 ~ process:', process);

if (!commitMsgPath) {
  console.error('❌ Не указан путь к сообщению коммита.');
  process.exit(1);
}

const commitMsg = fs.readFileSync(commitMsgPath, 'utf-8').trim();

if (!commitMsg || commitMsg.length === 0) {
  console.error(
    '❌ Сообщение коммита обязательно! Используйте: git commit -m "ваше сообщение"',
  );
  process.exit(1);
}

// Дополнительно: можно добавить проверку длины или формат (например, по Conventional Commits)
if (commitMsg.length < 3) {
  console.error('❌ Сообщение коммита слишком короткое (минимум 3 символа).');
  process.exit(1);
}

console.log(`✅ Сообщение коммита валидно: "${commitMsg}"`);
process.exit(0);
