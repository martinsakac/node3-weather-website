
const request = require('request')

const forecast = (lat, long, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=72ef97e070efdcb27953c411ec0f47c4&query=' + encodeURIComponent(lat) + ',' + encodeURIComponent(long) + '&units=m'    
    
    request({ url, json: true }, (error, {body}) => {
        if (error) {
            callback('Unable to connect to the services.', undefined)
        } else if (body.error) {
            callback('Weather forecast has NOT been fetched for input location. Try again.', undefined)
        } else {
            callback(undefined, {
                location: body.location.name,
                temperature: body.current.temperature,
                precip: body.current.precip
            })
        }
    })
}

module.exports = forecast
