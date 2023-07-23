# 支出紀錄 Expense Tracker
一個可以幫助使用者紀錄個人花費的線上平台。該網站提供了一個集中的地方，使用者可以瀏覽支出紀錄、依分類查看統計金額
## Features - 產品功能
1. 註冊使用者 (也可以透過 Facebook Login 直接登入)

![image](https://github.com/boxunw/expense-tracker/blob/main/image/register.png)

2. 使用者登入後可以新增支出

![image](https://github.com/boxunw/expense-tracker/blob/main/image/new.png)

3. 使用者可以瀏覽、編輯和刪除支出紀錄

![image](https://github.com/boxunw/expense-tracker/blob/main/image/home.png)

4. 使用者可以依分類了解統計金額

![image](https://github.com/boxunw/expense-tracker/blob/main/image/category.png)

## Environment SetUp - 環境建置
1. [Node.js](https://nodejs.org/zh-tw)
2. [MongoDB Atlas 資料庫](https://www.mongodb.com/atlas/database)
3. [Robo 3T 資料庫管理工具](https://robomongo.org/)
4. [Meta for developers](https://developers.facebook.com/)

## Installing - 安裝流程
1. 請先確認已安裝Node.js，若無，至環境建置第1項點擊安裝
2. 開啟終端機(Terminal)，指令cd到欲放置專案位置，Clone此專案至本機電腦
```
git clone https://github.com/boxunw/expense-tracker.git
```
3. 打開專案資料夾
```
cd expense-tracker
```
4. 安裝 npm 套件
```
npm install
```
5. 根據資料夾內 .env.example 設定 .env 檔:
可至 MongoDB Atlas 雲端資料庫申請及使用 Robo 3T 創建資料庫後取得 MONGODB_URI; 另外需前往 Meta for developers 申請應用程式編號及密鑰分別放入 FACEBOOK_ID 和 FACEBOOK_SECRET

6. 產生種子資料
```
npm run seed
```
7. 開啟程式
```
npm run dev
```
8. 等待終端機出現以下字樣
```
mongodb connected!
```
9. 在瀏覽器輸入以下網址即可開始使用此工具
```
http://localhost:3000
```
