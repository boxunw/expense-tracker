const express = require('express')
const router = express.Router()

// 設定登入路由
router.get('/login', (req, res) => {
  res.render('login')
})

module.exports = router