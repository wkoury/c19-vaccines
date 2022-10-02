const request = require("request");

const url = "https://raw.githubusercontent.com/govex/COVID-19/master/data_tables/vaccine_data/us_data/time_series/time_series_covid19_vaccine_us.csv";

exports.getData = function(){
	return new Promise((resolve, reject) => {
		request({uri: url}, function(error, response, body){
			const lines = body.split("\n");

			let data = [];

			lines.forEach(line => {
				let token = line.split(",");
				data.push(token);
			});

			resolve(data);
		});
	});
}

const commitsUrl = "https://api.github.com/repos/govex/COVID-19/commits";

exports.getCommits = function(){
	return new Promise(resolve => {
		request({uri: commitsUrl, headers: {"User-Agent": "request"}}, function(error, response, body){
			resolve(body);
		});
	});
}