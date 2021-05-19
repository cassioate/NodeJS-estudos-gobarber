import 'dotenv/config'
import App from './app';

// const App = require('./app');

App.listen(process.env.APP_PORT);
