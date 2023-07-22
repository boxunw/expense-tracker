const express = require('express')
const app = express()
const port = 3000

// 設定首頁路由
app.get('/', (req, res) => {
  res.send('hello world')
})

// 啟動並監聽伺服器
app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})