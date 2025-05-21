// src/lib/api/index.ts

// 導出配置和工具函數
export * from './api-config';

// 導出各模塊的 API 函數
export * from './auth-api';
export * from './admin-api';
export * from './teams-api';
export * from './players-api';
export * from './leagues-api';
export * from './matches-api';

// 再導出頻繁使用的 API 函數，方便其他模組直接引用
import { loginUser, refreshToken, verifyToken } from './auth-api';
import { fetchCurrentUser } from './admin-api';

export {
    loginUser,
    refreshToken,
    verifyToken,
    fetchCurrentUser
};
