# 桃園獵鷹宇宙管理平台

這是一個使用 Next.js 前端和 Django 後端開發的足球管理平台專案。

## 系統需求

- Node.js 16.x 或更高版本
- Python 3.9 或更高版本
- npm 或 yarn 套件管理器

## 快速開始

### 使用互動式腳本（推薦）

我們提供了一個互動式 PowerShell 腳本來簡化環境設定和啟動過程：

```powershell
.\start-dev.ps1
```

按照提示選擇相應的選項來設定環境或啟動開發伺服器。

### 手動設定

#### 前端（Next.js）

1. 安裝 Node.js 依賴套件：

```bash
npm install --legacy-peer-deps
```

2. 啟動開發伺服器：

```bash
npm run dev
```

前端伺服器將在 http://localhost:9002 啟動。

#### 後端（Django）

1. 創建並啟用虛擬環境（若尚未建立）：

```bash
# 建立虛擬環境
python -m venv venv_backend

# 在 Windows 上啟用
.\venv_backend\Scripts\activate

# 在 macOS/Linux 上啟用
source venv_backend/bin/activate
```

2. 安裝 Python 依賴套件：

```bash
cd backend
pip install -r requirements.txt
```

3. 應用資料庫遷移：

```bash
python manage.py migrate
```

4. 啟動開發伺服器：

```bash
python manage.py runserver
```

後端伺服器將在 http://localhost:8000 啟動。

### Genkit AI 功能（選用）

要運行 Genkit 開發伺服器（AI 功能）：

```bash
npm run genkit:dev
```

這將啟動 Genkit Studio，通常在 `http://localhost:4000/streams`。

您可以在 `src/ai/flows/ai-drill-suggestion-flow.ts` 中探索 AI 功能。

## 專案結構

- `/src` - Next.js 前端代碼
  - `/app` - 頁面和路由
  - `/components` - UI 組件
  - `/contexts` - React 上下文
  - `/hooks` - 自定義 React Hooks
  - `/lib` - 共用函式和類型定義
- `/backend` - Django 後端代碼
  - `/users` - 使用者管理模塊
  - `/teams` - 團隊管理模塊
  - `/leagues` - 聯賽管理模塊
  - `/matches` - 比賽管理模塊
  - `/players` - 球員管理模塊

## 可用腳本

* `npm run dev`: 在 9002 端口啟動 Next.js 開發伺服器
* `npm run build`: 建構生產環境專案
* `npm run start`: 啟動生產伺服器
* `npm run lint`: 運行程式碼檢查
* `npm run typecheck`: 檢查 TypeScript 類型
* `npm run genkit:dev`: 啟動 Genkit AI 開發伺服器
* `npm run genkit:watch`: 啟動 Genkit AI 開發伺服器（含檔案監視）
