# YASSIR BACKEND TEST APPLICATION
### NODE_VERSION: 16.13.2
### NPM_VERSION: 8.1.2

## 1- Install node_modules: npm install
## 2- Run project: npm run dev
## 3- Build project: npm run build

> Air Quality by position (longitude && latitude)
http://localhost:4000/pollution/byPosition/:latitude/:longitude

> Most polluted range time for Paris zone
http://localhost:4000/pollution/mostPolluted/:standard    (standard === 'EPA' || standard === 'MEP')

> CRON Job
./jobs/jobs
