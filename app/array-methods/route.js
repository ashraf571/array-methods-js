const express = require('express')
const router = express.Router()
const service = require('./service')

router.get("/reduce", (req, res, next) => {

    try {
        res.send(service.reduceExamples())
    } catch (error) {
        next(error)
    }
})

router.get("/slice", (req, res, next) => {

    try {
        res.send(service.sliceExamples())
    } catch (error) {
        next(error)
    }
})

router.get("/splice", (req, res, next) => {

    try {
        res.send(service.spliceExamples())
    } catch (error) {
        next(error)
    }
})

router.get("/join", (req, res, next) => {

    try {
        res.send(service.joinExamples())
    } catch (error) {
        next(error)
    }
})

router.get("/flat", (req, res, next) => {

    try {
        res.send(service.flatExamples())
    } catch (error) {
        next(error)
    }
})

router.get("/at", (req, res, next) => {

    try {
        res.send(service.atExamples())
    } catch (error) {
        next(error)
    }
})

module.exports = router