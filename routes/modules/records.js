const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

// 設定路由
router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', (req, res) => {
  const userId = req.user._id
  // 處理新增紀錄流程中的錯誤訊息
  const { name, date, category, amount } = req.body
  const new_error = {}
  if (!name || !date || !category || !amount) {
    new_error.message = '請完成所有必填欄位！'
  }
  if (Object.keys(new_error).length) {
    return res.render('new', {
      new_error,
      name,
      date,
      category,
      amount
    })
  }
  return Category.findOne({ name: category })
    .lean()
    .then(category => {
      req.body.categoryId = category._id
      req.body.userId = userId
      return req.body
    })
    .then(record => {
      Record.create(record)
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

router.get('/:id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Record.findOne({ _id, userId })
    .populate('categoryId')
    .lean()
    .then(record => {
      record.date = new Date(record.date).toISOString().slice(0, 10)
      return record
    })
    .then(record => res.render('edit', { record }))
    .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  const category = req.body.category
  return Category.findOne({ name: category })
    .lean()
    .then(category => {
      req.body.categoryId = category._id
      req.body.userId = userId
      return req.body
    })
    .then(record => Record.updateOne({ _id, userId }, record))
    .then(() => res.redirect(`/`))
    .catch(error => console.log(error))
})

router.delete('/:id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.id
  return Record.findOne({ _id, userId })
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router