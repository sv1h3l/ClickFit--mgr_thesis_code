"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const generateToken = () => {
    return Array(8) // 8 bloků o délce 8 znaků (64 znaků celkem)
        .fill(null)
        .map(() => Math.random().toString(36).slice(2, 10))
        .join('');
};
exports.generateToken = generateToken;
//# sourceMappingURL=generateToken.js.map