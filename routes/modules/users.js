const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../../models/user')

// 設定登入路由
router.get('/login', (req, res) => {
  res.render('login')
})

// 驗證 request 登入狀態
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))

// 設定註冊路由
router.get('/register', (req, res) => {
  res.render('register')
})

// 註冊使用者資訊
router.post('/register', (req, res) => {
  // 取得註冊表單參數
  const { name, email, password, confirmPassword } = req.body
  // 處理註冊流程中可能的錯誤訊息
  const errors = []
  if (!email || !password || !confirmPassword) {
    errors.push({ message: '請完成所有必填欄位' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符！' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }
  // 檢查使用者是否已經註冊
  User.findOne({ email }).then(user => {
    // 如果已經註冊：退回原本畫面
    if (user) {
      errors.push({ message: '這個 Email 已經註冊過了。' })
      res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })
    }
    // 如果還沒註冊：寫入資料庫
    return User.create({
      name,
      email,
      password
    })
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
  })
    .catch(err => console.log(err))
})

// 使用者登出路由
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')
})

module.exports = router