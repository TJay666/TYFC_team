# Toast 系統遷移指南

原來的 toast 系統存在問題，導致應用程序中出現運行時錯誤。我們已經實現了一個新的簡化版 toast 系統，以解決這個問題。

## 遷移步驟

1. 將導入從 `@/hooks/use-toast` 更改為 `@/hooks/use-simple-toast`：

```typescript
// 變更前
import { useToast } from "@/hooks/use-toast";

// 變更後
import { useToast } from "@/hooks/use-simple-toast";
```

2. 將 `toast` 方法更改為 `addToast`：

```typescript
// 變更前
const { toast } = useToast();

// 變更後
const { addToast } = useToast();
```

3. 更新 toast 調用方式：

```typescript
// 變更前
toast({
  title: "標題",
  description: "描述",
  variant: "destructive" // 用於錯誤
});

// 變更後
addToast({
  title: "標題",
  message: "描述", // 注意: description 改為 message
  type: "error" // 可以是 "success", "error", "warning", 或 "default"
});
```

4. 變更特殊選項：

- `variant: "destructive"` 改為 `type: "error"`
- `description` 改為 `message`
- 如需設置持續時間: `duration: 5000` (毫秒)

## 已更新的文件

以下文件已經更新為使用新的 toast 系統：

- `src/app/layout.tsx`
- `src/components/sections/matches-section.tsx`
- `src/components/sections/players-section.tsx`
- `src/app/page.tsx`

## 需要更新的文件

以下文件可能還需要更新：

- `src/components/sections/leagues-section.tsx`
- `src/components/sections/statistics-section.tsx`
- 其他使用 toast 的組件或頁面
