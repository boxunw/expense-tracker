const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

// 設定首頁路由
router.get('/', (req, res) => {
  const userId = req.user._id
  let totalAmount = 0
  Record.find({ userId })
    .populate('categoryId')
    .lean()
    .sort({ date: -1, _id: -1 })
    .then(records => records.map(record => {
      record.date = new Date(record.date).toISOString().slice(0, 10)
      return record
    }))
    .then(records => {
      records.forEach(record => totalAmount += record.amount)
      res.render('index', { records, totalAmount })
    })
    .catch(error => console.error(error))
})

router.post('/filter', (req, res) => {
  const userId = req.user._id
  let totalAmount = 0
  const selectedCategory = req.body.category
  if (!selectedCategory) {
    return res.redirect(`/`)
  }
  Category.findOne({ name: selectedCategory })
    .lean()
    .then(category => {
      const categoryId = category._id
      return Record.find({ categoryId, userId })
        .populate('categoryId')
        .lean()
        .sort({ date: -1, _id: -1 })
        .then(records => records.map(record => {
          record.date = new Date(record.date).toISOString().slice(0, 10)
          return record
        }))
        .then(records => {
          records.forEach(record => totalAmount += record.amount)
          res.render('index', { records, selectedCategory, totalAmount })
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})

module.exports = router