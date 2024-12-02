const express = require('express');
const axios = require('axios');
const app = express();


const allowCORS = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204); // Handle preflight
    }
    next(); // Move to the next middleware/route
};

app.use(allowCORS);

app.get('/secret', async (req, res) => {

    const secretKey = `YOUR STRIPE SECRET KEY`;

    try {
        const params = new URLSearchParams({
            'amount': '23456',
            'currency': 'EUR',
            'setup_future_usage': 'off_session'
        });
        params.append('payment_method_types[]', 'card');
        params.append('payment_method_types[]', 'link');
        const response = await axios.post(
            'https://api.stripe.com/v1/payment_intents',
            params,
            {
                headers: {
                    'Authorization': `Bearer ${secretKey}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }
        );
        console.log('Client Secret:', response.data.client_secret);
        res.json({client_secret: response.data.client_secret});
    } catch (error) {
        console.error('Error creating Payment Intent:', error);
        console.log(error.response.request.data);
    }
});

app.get('/index', (req, res) => {
    const responseJson = { "key": "dude" };
    res.json(responseJson);
})

app.listen(3000, () => {
    console.log('Running on port 3000');
});