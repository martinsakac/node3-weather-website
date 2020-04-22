const path = require('path')
const express = require('express')
const hbs = require('hbs')

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

// Define paths for Express config
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(path.join(__dirname, '../public')))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Index',
        name: 'Martin Sakac'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Martin Sakac'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'Martin Sakac'
    })
})


app.get('/weather', (req, res) => {
    const address = req.query.address
    if (!address) {
        return res.send({error: 'Address is mandatory'})
    }
    geocode(address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            // return error - shorthand
            return res.send({error})
        }
        console.log(latitude, longitude, location)
        // object destructuring
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({error: error})
            }
            console.log(forecastData)
            res.send({
                address: forecastData.location,
                temperature: forecastData.temperature,
                precipation: forecastData.precip,
                location,
                addressQuery: req.query.address
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term.'
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404 Not Found',
        errorMessage: 'Help article not found.',
        name: 'Martin Sakac'
    })
})

app.get('/*', (req, res) => {
    res.render('404', {
        title: '404 Not Found',
        errorMessage: 'Page not found.',
        name: 'Martin Sakac'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})
