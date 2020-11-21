const express = require('express')
const router = express.Router()


router.get('/', (req, res, next) => {
    console.log('GET request at /myroute')
    res.status(200).json({
        message:'GET request at /myroute'
    })
})

router.post('/', (req, res, next) => {
    console.log('POST request at /myroute')
    res.status(201).json({
        message:'GET request at /myroute'
    })
})

router.patch('/', (req, res, next) => {
    console.log('PATCH request at /myroute')
    res.status(202).json({
        message:'GET request at /myroute'
    })
})

router.delete('/', (req, res, next) => {
    console.log('DELETE request at /myroute')
    res.status(202).json({
        message:'GET request at /myroute'
    })
})


module.exports = router