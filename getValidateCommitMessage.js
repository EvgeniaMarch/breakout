import * as fs from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// - type: один из разрешённых
// - (scope): опционально
// - : после типа и области
// - описание: обязательно, после двоеточия с пробелом
const conventionalPattern =
  /^(feat|fix|docs|style|refactor|test|chore|perf)(?:\(([^)]+)\))?: (.+)$/;

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
if (!match) {
  console.warn(
    '⚠️  Сообщение не соответствует формату <тип>(<область>): <описание>',
  );
  process.exit(1);
}
