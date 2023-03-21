import 'babel-polyfill';
import 'dotenv/config';

import IndexRoute 			from './routes/index';
import PollutionRoute 		from './routes/pollution';
import bodyParser 			from 'body-parser';
import compression 			from 'compression';
import cors 				from 'cors';
import cronJobs 	 		from './jobs/jobs';
import express 				from 'express';
import mongoose 			from 'mongoose';
import path 				from 'path';

const app = express();
app.use(cors({ origin: '*' }));
const server = require('http').createServer(app);
app.use(compression());
app.use(bodyParser.json({ 'type': '*/*', limit: '20mb' }));
app.use(express.static(path.resolve('./public')));

/**
 * CRON JOBS
 */
(async () => {
    await cronJobs.saveAirQualityParis();
})();

/**
 * MONGODB DATABASE CONNECTION
 */
process.env.MONGO_PRODUCTION_URL = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
mongoose.connect(process.env.MONGO_PRODUCTION_URL, {
	autoReconnect: true,
	poolSize: 20,
	socketTimeoutMS: 480000,
	keepAlive: 300000,
	keepAliveInitialDelay: 300000,
	connectTimeoutMS: 30000,
	reconnectTries: Number.MAX_VALUE,
	reconnectInterval: 1000,
	useCreateIndex: true,
	useNewUrlParser: true
});

mongoose.connection.once('open', () => console.log('Database connection established successfully!'))
	.on('error', () => console.log('Error when connecting to database!'));

/**
 * LOGS TO EXPRESS
 */
app.use((req, res, next) => {
	let log = {
		request: {
			"Original Url": req.originalUrl,
			"IP": req.ip,
			"body": JSON.stringify(req.body),
			"method": req.method,
			"time": new Date().toUTCString(),
		},
		response: {
			"status": res.statusCode,
			"time": new Date().toUTCString(),
		}
	}
	console.table(log);
	next();
});

/**
 * USE ROUTES
 */
app.use('/api/pollution', PollutionRoute);
app.use('/', IndexRoute);

/**
 * VIEW ENGINE SETUP
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/**
 * APPLY SOCKET IO MIDDLEWARE
 */
//require('./middlewar/socket')(io);

const port = process.env.PORT;
server.listen(port, () => console.log('Express server runing on port ' + port));