const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const app = express()
const port = 3000

// 設定連線到 mongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

// 啟用樣板引擎
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// 設定首頁路由
app.get('/', (req, res) => {
  res.render('index')
})

// 啟動並監聽伺服器
app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})