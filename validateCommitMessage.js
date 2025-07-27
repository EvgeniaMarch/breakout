"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var commitMsgPath = process.argv[2];
console.log('🚀 ~ process:', process);
if (!commitMsgPath) {
    console.error('❌ Не указан путь к сообщению коммита.');
    process.exit(1);
}
var commitMsg = fs_1.default.readFileSync(commitMsgPath, 'utf-8').trim();
if (!commitMsg || commitMsg.length === 0) {
    console.error('❌ Сообщение коммита обязательно! Используйте: git commit -m "ваше сообщение"');
    process.exit(1);
}
// Дополнительно: можно добавить проверку длины или формат (например, по Conventional Commits)
if (commitMsg.length < 3) {
    console.error('❌ Сообщение коммита слишком короткое (минимум 3 символа).');
    process.exit(1);
}
console.log("\u2705 \u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435 \u043A\u043E\u043C\u043C\u0438\u0442\u0430 \u0432\u0430\u043B\u0438\u0434\u043D\u043E: \"".concat(commitMsg, "\""));
process.exit(0);
