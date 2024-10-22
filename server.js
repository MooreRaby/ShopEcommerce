const app = require('./src/app')

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
})

process.on('SIGINT', () => {
    server.close(() => console.log(`exit server express`))
})
