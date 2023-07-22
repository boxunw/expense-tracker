const mongoose = require('mongoose')
const Record = require('../record')
const recordList = require('../../record.json').results
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

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
  Record.create(recordList)
    .then(() => {
      console.log('done')
      process.exit()
    })
})
