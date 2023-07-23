const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Record = require('./models/record')
const Category = require('./models/category')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const app = express()
const port = 3000

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
})

// 啟用樣板引擎
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// 每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))

// 設定首頁路由
app.get('/', (req, res) => {
  Record.find()
    .populate('categoryId')
    .lean()
    .sort({ date: -1, _id: -1 })
    .then(records => records.map(record => {
      record.date = new Date(record.date).toISOString().slice(0, 10)
      return record
    }))
    .then(records => res.render('index', { records }))
    .catch(error => console.error(error))
})

app.get('/records/new', (req, res) => {
  return res.render('new')
})

app.post('/records', (req, res) => {
  const name = req.body.category
  return Category.findOne({ name })
    .lean()
    .then(category => {
      req.body.categoryId = category._id
      return req.body
    })
    .then(record => {
      Record.create(record)
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.get('/records/:id/edit', (req, res) => {
  const _id = req.params.id
  return Record.findOne({ _id })
    .populate('categoryId')
    .lean()
    .then(record => {
      record.date = new Date(record.date).toISOString().slice(0, 10)
      return record
    })
    .then(record => res.render('edit', { record }))
    .catch(error => console.log(error))
})

app.post('/records/:id/edit', (req, res) => {
  const _id = req.params.id
  const name = req.body.category
  return Category.findOne({ name })
    .lean()
    .then(category => {
      req.body.categoryId = category._id
      return req.body
    })
    .then(record => Record.updateOne({ _id }, record))
    .then(() => res.redirect(`/`))
    .catch(error => console.log(error))
})

app.post('/records/:id/delete', (req, res) => {
  const _id = req.params.id
  return Record.findOne({ _id })
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.post('/filter', (req, res) => {
  const selectedCategory = req.body.category
  Category.findOne({ name: selectedCategory })
    .lean()
    .then(category => {
      const categoryId = category._id
      return Record.find({ categoryId })
        .populate('categoryId')
        .lean()
        .sort({ date: -1, _id: -1 })
        .then(records => records.map(record => {
          record.date = new Date(record.date).toISOString().slice(0, 10)
          return record
        }))
        .then(records => res.render('index', { records, selectedCategory }))
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

// 啟動並監聽伺服器
app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})