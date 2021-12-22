const Twitter = require('twitter');
const request = require('request');
const client = new Twitter({
    consumer_key: 'eVvN4jRX15N71Ymb4yzMSIzVS',
    consumer_secret: 'yDc3JWivW2HlLxBU6lYyW0t3bgIOUqKOaFOnKKwuGmLXFChdHc',
    access_token_key: '1086756366847479810-YvDsuLQtmO8Vkfnow9TPspRRLJ9nCJ',
    access_token_secret: 'HB8JKSyCMxovKMJl1Z4cCmSz81beB1t2zxl6L4SDWMrV9',
});

const url = 'https://gateway.watsonplatform.net/tone-analyzer/api';

function getTweets(placeID) {
    const params = { q: `place:${placeID}`, count: 100 };

    return new Promise((res, rej) => {
        client.get('search/tweets', params, (error, tweets) => {
            let allText = '';
            tweets.statuses.forEach(tweet => {
                allText += tweet.text;
            });
            if (!error) {
                res(allText);
            } else if (error) {
                rej(error);
            }
        });
    });
}

function getLocationCode(geocode) {
    return new Promise((resolve, reject) => {
        client.get('geo/reverse_geocode', geocode, (error, locationCode) => {
            if (!error) {
                resolve(locationCode);
            } else if (error) {
                reject(error);
            }
        });
    });
}

export function getSentiment(req, res) {
    console.log(req.body);
    const geocode = req.body;
    getLocationCode(geocode).then(locationCode => {
        getTweets(locationCode.result.places[0].id).then(tweets => {
            const auth = `Basic ${new Buffer('apikey:JBmbieYa_QhN2JVVAJVcT94Z_s8LS-jJ08QqXW75cQkG').toString('base64')}`;
            const options = {
                url: `${url}/v3/tone?version=2017-09-21`,
                headers: {
                    Authorization: auth,
                },
                body: tweets,
            };
            request.post(options, (err, response, body) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(200).send(body);
                }
            });
        });
    })
    .catch(err => {
        console.log(err);
    });
}
