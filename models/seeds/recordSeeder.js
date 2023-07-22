const mongoose = require('mongoose')
const Record = require('../record')
const Category = require('../category')
const category = require('../category')
const recordList = require('../../record.json').results
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// 設定連線到 mongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
  Promise.all(Array.from(
    { length: recordList.length },
    (_, i) => {
      return Category.findOne({ name: recordList[i].category })
        .lean()
        .then(category => recordList[i].categoryId = category._id)
        .catch(error => console.log(error))
    }
  ))
    .then(() => Record.create(recordList))
    .then(() => {
      console.log('done')
      process.exit()
    })
})
