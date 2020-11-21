const express = require('express')
const app = express()

const PORT = 4200 || process.env.PORT

app.listen(PORT, () =>
    console.log('Express listening on Port %s', PORT)
)

//Routes
const myRouteRoutes = require('./api/routes/myroute')
app.use('/myroute', myRouteRoutes)