const pollutionService = require('../services/pollution');
const schedule = require('node-schedule');
const { default: AirQuality } = require('../models/AirQuality');

/**
 * Run job every one minute to save AirQuality for Paris Zone
 */
exports.saveAirQualityParis = async () => {
    schedule.scheduleJob('0 */1 * * * *', async () => {
        const parisLatitude = 48.856613;
        const parisLongitude = 2.352222;
        const result = await pollutionService.getNearestCityByPosition(parisLatitude, parisLongitude);

        if (result.statusCode == 200) {
            const pollution = result.body.data.current.pollution;
            let parisAirQuality = new AirQuality({
                ts: pollution.ts,
                aqius: pollution.aqius,
                mainus: pollution.mainus,
                aqicn: pollution.aqicn,
                maincn: pollution.maincn,
                creation_date: new Date()
            });

            parisAirQuality.save().then(airQuality => {
                console.log("Paris Air Quality saved - " + airQuality.creation_date);
            }).catch(function(err){
                console.log("Error while savind Air Quality for Paris");
            })
        }
    })
}