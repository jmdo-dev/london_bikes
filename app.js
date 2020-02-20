const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const keys = require('./config/keys');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
	const bikepoints = [];
	const url = `https://api.tfl.gov.uk/BikePoint/?app_key=${keys.TflApiKey}&app_id=${keys.TflId}`;
	const response = await axios.get(url);
	const data = response.data;
	data.forEach(function({ commonName, lat, lon, additionalProperties }) {
		bikepoints.push({
			name: commonName,
			location: {
				lat,
				lon,
			},
			bikes: Number(additionalProperties[6].value),
			spaces: Number(additionalProperties[7].value),
		});
	});

	let key = keys.googleDevApiKey;
	res.render('home', { bikepoints, key });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log('Server Has Started');
});


