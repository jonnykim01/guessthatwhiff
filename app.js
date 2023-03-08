import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sessions from 'express-session'
import msIdExpress from 'microsoft-identity-express'
// For Localhost
const appSettings = {
    appCredentials: {
        clientId:  "d47af6a1-fdaf-4ba3-a10e-8ba17b7f3f98",
        tenantId:  "f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
        clientSecret:  "BQW8Q~ypjGVnvylbrhy-6zbwjm3ZMwM2yZAAcbUn"
    },	
    authRoutes: {
        redirect: "http://localhost:3000/redirect", //note: you can explicitly make this "localhost:3000/redirect" or "examplesite.me/redirect"
        error: "/error", // the wrapper will redirect to this route in case of any error.
        unauthorized: "/unauthorized" // the wrapper will redirect to this route in case of unauthorized access attempt.
    }
};
// For Deployment
// const appSettings = {
//     appCredentials: {
//         clientId:  "2fc9b6b9-2df0-4293-a507-76f8cdd08d50",
//         tenantId:  "f6b6dd5b-f02f-441a-99a0-162ac5060bd2",
//         clientSecret:  "5jw8Q~5n9XloV4Kk034M_LkPBYudfjwAJ7QpIbiC"
//     },	
//     authRoutes: {
//         redirect: "https://guessthatwhiff.azurewebsites.net/redirect", //note: you can explicitly make this "localhost:3000/redirect" or "examplesite.me/redirect"
//         error: "/error", // the wrapper will redirect to this route in case of any error.
//         unauthorized: "/unauthorized" // the wrapper will redirect to this route in case of unauthorized access attempt.
//     }
// };

import apiRouter from './routes/api/api.js';

import models from './models.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { ppid } from 'process'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// microsoft auth middleware
const oneDay = 1000 * 60 * 60 * 24
app.use(sessions({
    secret: "this is some secret key I am making up 09532poi fn4eelhu jfcbds",
    saveUninitialized: true,
    cookie: {maxAge: oneDay},
    resave: false
}))

const msid = new msIdExpress.WebAppAuthClientBuilder(appSettings).build()
app.use(msid.initialize())

// mongoDB middleware
app.use((req, res, next) => {
    req.models = models
    next()
})

app.use('/api', apiRouter);

// microsoft auth routes
app.get('/signin', 
    msid.signIn({postLoginRedirect: '/'})
)

app.get('/signout',
    msid.signOut({postLogoutRedirect: '/'})
)

app.get('/error', (req, res) => {
    res.status(500).send("Error: Server error")
})

app.get('/unauthorized', (req, res) => {
    res.status(401).send("Error: Unauthorized")
})

export default app;
