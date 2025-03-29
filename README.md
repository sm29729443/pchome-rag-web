# RAG 增強搜尋系統

這是一個基於 Angular 19.2 的前端專案，使用 RAG (Retrieval Augmented Generation) 技術提供智能產品搜尋和比較功能。

## 技術棧

- **前端框架**: Angular 19.2
- **UI/UX**: Tailwind CSS 3.4
- **後端**: Python + FastAPI (已實現)
- **認證**: JWT 身份驗證

## 功能特點

- **智能搜尋**: 允許使用者輸入關鍵字進行搜尋，系統使用 RAG 技術提供更準確的結果
- **產品比較**: 展示產品之間的詳細比較，包括優點、缺點、關鍵特性等
- **最佳選擇摘要**: 根據不同的維度（整體選擇、性價比、品質等）推薦最佳產品
- **用戶認證**: 使用 JWT 進行用戶認證和授權

## 專案設置

### 先決條件

- Node.js (18.x 或更高版本)
- Angular CLI (`npm install -g @angular/cli`)

### 安裝步驟

1. 確保您已經安裝了 Node.js 和 Angular CLI
2. 執行安裝腳本來安裝專案依賴:

```bash
setup-project.bat
```

3. 啟動開發伺服器:

```bash
ng serve
```

應用將在 `http://localhost:4200/` 可用。

## 專案結構

```
src/
├── app/
│   ├── components/         # 共用組件
│   ├── guards/             # 路由守衛
│   │   └── auth.guard.ts   # 身份驗證守衛
│   ├── interceptors/       # HTTP 攔截器
│   │   └── auth.interceptor.ts
│   ├── pages/              # 頁面組件
│   │   ├── login/          # 登入頁面
│   │   └── search/         # 搜尋頁面
│   ├── services/           # 服務層
│   │   ├── auth.service.ts # 認證服務
│   │   └── search.service.ts
│   ├── app.component.ts    # 根組件
│   ├── app.config.ts       # 應用配置
│   └── app.routes.ts       # 路由配置
├── environments/           # 環境配置
└── styles.css              # 全局樣式
```

## API 集成

此前端應用與 FastAPI 後端集成。主要 API 端點包括:

### 搜尋 API

- **端點**: `/app/search`
- **方法**: POST
- **請求體**:
  ```json
  {
    "content": "搜尋關鍵字"
  }
  ```
- **回應體**:
  ```json
  {
    "comparison_results": {
      "best_choice": "產品名稱",
      "best_value": "產品名稱",
      "best_quality": "產品名稱",
      "most_features": "產品名稱"
    },
    "product_comparisons": [
      {
        "product_name": "產品 A",
        "brand": "品牌名稱",
        "price": "價格",
        "pros": ["優點 1", "優點 2", "..."],
        "cons": ["缺點 1", "缺點 2", "..."],
        "key_features": ["特性 1", "特性 2", "..."],
        "suitable_scenarios": ["場景 1", "場景 2", "..."],
        "rating": 8.5
      },
      // 更多產品...
    ],
    "analysis": "整體比較分析和建議"
  }
  ```

### 認證 API

- **端點**: `/token`
- **方法**: POST
- **請求體**: FormData 格式的用戶名和密碼
- **回應體**:
  ```json
  {
    "access_token": "JWT 令牌",
    "token_type": "bearer",
    "user": {
      "username": "用戶名",
      "email": "用戶郵箱"
    }
  }
  ```

## Angular 19 新特性應用

此專案充分利用了 Angular 19 的新特性：

- **新控制流語法**: 使用 `@if`, `@for`, `@switch` 等新語法
- **延遲載入視圖**: 使用 `@defer` 實現延遲載入
- **獨立組件**: 所有組件都使用獨立組件架構

## 關於 RAG 技術

RAG (Retrieval Augmented Generation) 是一種將檢索系統與生成式 AI 結合的技術：

1. **檢索**: 首先從數據庫中檢索與用戶查詢相關的文檔或信息
2. **增強**: 用檢索到的相關信息來增強 AI 模型的上下文
3. **生成**: 增強後的 AI 模型能生成更準確、更相關的回應

在本系統中，RAG 技術用於提供精確的產品比較和推薦，結合產品數據庫和先進的 LLM (大型語言模型)。
