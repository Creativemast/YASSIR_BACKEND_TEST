const request = require('request');
const { default: AirQuality } = require('../models/AirQuality');

/**
 * use request to call IQAIR api by latitude & longitude
 * @param {*} latitude 
 * @param {*} longitude 
 * @param {*} callback 
 */
const getNearestCityRouter = (latitude, longitude, callback) => {
    const url = `${process.env.IQAIRROUTER}v2/nearest_city?lat=${latitude}&lon=${longitude}&key=${process.env.IQAIRKEY}`;
    request({ url, json: true, rejectUnauthorized: false }, (err, res) => {
        if (err) {
            console.log(err);
            return callback("cannot connect", undefined);
        } else if (res.body.message === "Too Many Requests") {
            return callback("too many request, please try again..", undefined);
        } else {
            return callback(undefined, res);
        }
    });
};

/**
 * get Nearest city by position
 * @param {*} latitude 
 * @param {*} longitude 
 * @returns AirQuality
 */
function getNearestCityByPosition(latitude, longitude) {
    return new Promise(resolve => {
        getNearestCityRouter(latitude, longitude, (err, res) => {
            if (err) {
                resolve({ error: err, res: {} })
            }
            resolve(res)
        })
    })
}

/**
 * get Most polluted paris zone
 * @param {*} standard EPA or MEP
 * @returns Date
 */
function getMostPollutedTimeByStandard(standard) {
    return new Promise(resolve => {
        if (standard === 'EPA') {
            AirQuality.find().sort({aqius: -1}).limit(1).exec((err, airQuality) => {
                if (airQuality[0]) resolve(airQuality[0].creation_date)
                else resolve(null)
            })
        } else if (standard === 'MEP') {
            AirQuality.find().sort({aqicn: -1}).limit(1).exec((err, airQuality) => {
                if (airQuality[0]) resolve(airQuality[0].creation_date)
                else resolve(null)
            })
        }
    })
}

module.exports.getNearestCityByPosition = getNearestCityByPosition;
module.exports.getMostPollutedTimeByStandard = getMostPollutedTimeByStandard;