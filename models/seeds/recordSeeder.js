const Record = require('../record')
const Category = require('../category')
const category = require('../category')
const recordList = require('../../record.json').results
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const db = require('../../config/mongoose')

// 資料庫連線成功
db.once('open', () => {
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
      console.log('record seeds created')
      process.exit()
    })
})
