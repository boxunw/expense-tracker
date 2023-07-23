const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Record = require('../record')
const Category = require('../category')
const User = require('../user')
const recordList = require('../../record.json').results
const db = require('../../config/mongoose')

const SEED_USER = {
  name: 'root',
  email: 'root@example.com',
  password: '12345678'
}

// 資料庫連線成功
db.once('open', () => {
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER.password, salt))
    .then(hash => User.create({
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: hash
    }))
    .then(user => {
      const userId = user._id
      return Promise.all(Array.from(
        { length: recordList.length },
        (_, i) => {
          return Category.findOne({ name: recordList[i].category })
            .lean()
            .then(category => {
              recordList[i].categoryId = category._id
              recordList[i].userId = userId
              return recordList[i]
            })
            .catch(error => console.log(error))
        }
      ))
        .then(() => Record.create(recordList))
        .catch(error => console.log(error))
    })
    .then(() => {
      console.log('record seeds created')
      process.exit()
    })
})






// Promise.all(Array.from(
//   { length: recordList.length },
//   (_, i) => {
//     return Category.findOne({ name: recordList[i].category })
//       .lean()
//       .then(category => recordList[i].categoryId = category._id)
//       .catch(error => console.log(error))
//   }
// ))
//   .then(() => Record.create(recordList))
//   .then(() => {
//     console.log('record seeds created')
//     process.exit()
//   })
