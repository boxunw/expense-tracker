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
  const name = req.body.category
  return Category.findOne({ name })
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
  const name = req.body.category
  return Category.findOne({ name })
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