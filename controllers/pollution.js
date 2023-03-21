const pollutionService = require('../services/pollution');

exports.getPollutionByPosition = async (req, res, next) => {
    try {
        const latitude = req.params.latitude;
        const longitude = req.params.longitude;
        const result = await pollutionService.getNearestCityByPosition(latitude, longitude);

        if (result.statusCode == 200) {
            const pollution = result.body.data.current.pollution;
            res.status(200).json({
                Result: {
                    Pollution: pollution
                }
            })
        } else {
            res.status(500).json({
                status: false,
                error: 'Error while getting data',
            })
        }
    } catch (e) {
        res.status(500).json({
            status: false,
            error: e.message,
        })
    }
}

exports.getMostPollutedTimeByStandard = async (req, res, next) => {
    try {
        const standard = req.params.standard;
        // Verify if standard == null and standard == EPS or MEP
        if (standard && (standard === 'EPA' || standard === 'MEP' )) {
            const result = await pollutionService.getMostPollutedTimeByStandard(standard);

            res.status(200).json({
                status: true,
                data: result,
            })
        } else {
            res.status(501).json({
                status: false,
                error: 'Please specify a standart EPA(aqius) or MEP(aqicn)',
            })
        }        
    } catch (e) {
        res.status(500).json({
            status: false,
            error: e.message,
        })
    }
}