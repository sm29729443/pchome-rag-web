@echo off
echo ===================================
echo 安裝RAG搜尋專案所需依賴
echo ===================================

cd C:\Users\USER\vscode-work-space\pchome-rag-web\pchome-web

echo 安裝Angular Material...
call ng add @angular/material --skip-confirmation

echo 安裝Tailwind CSS...
npm install -D tailwindcss@3.4.1 postcss@8.4.35 autoprefixer@10.4.18

echo 初始化Tailwind CSS...
npx tailwindcss init

echo 安裝HTTP客戶端...
call ng add @angular/common/http

echo 安裝完成！
echo ===================================
echo 請查看README.md以了解專案結構和運行方式
echo ===================================
pause
