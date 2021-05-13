// import { Router } from 'express'

const { Router } = require('express');

const routes = new Router();

routes.get('/', (req, res) => {
    return res.json({message: "opa"})
})

module.exports = routes;