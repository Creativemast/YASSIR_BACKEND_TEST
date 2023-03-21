import mongoose from 'mongoose';

const Schema = mongoose.Schema; 

let AirQuality = new Schema(
    {
        ts: 
        {
            type: Date,
        },
        aqius: 
        {
            type: Number
        },
        mainus: 
        {
            type: String
        },
        aqicn: 
        {
            type: Number
        },
        maincn: 
        {
            type: String
        },
        creation_date:
        {
            type: Date,
            default: Date.now()
        }
    }
);

export default mongoose.model('AirQuality', AirQuality);