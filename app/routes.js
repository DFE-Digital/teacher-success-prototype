//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const flash = require('connect-flash')
router.use(flash())

router.all('*', (req, res, next) => {
  res.locals.flash = req.flash('success') // pass through 'success' messages only
  next()
})


// Add your routes here


router.post('/footer/cookies', (req, res) => {
    req.flash('success', 'Cookies preferences saved')
    res.redirect('/footer/cookies')
  })