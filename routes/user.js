const express = require('express')
const router = express.Router()
const {user_signup, activateAccount, forgotPassword, resetPassword} = require('../controllers/user')

router.post('/signup', user_signup)

router.post('/activate-account', activateAccount)

router.put('/forgot-password', forgotPassword )

router.put('/reset-password', resetPassword )

// router.post('/login', user_login)

// router.get('/password-reset', user_reset)

// router.post('/pw-reset', passwordResetMail)

// router.post('/change-password', handlePass);

module.exports = router;