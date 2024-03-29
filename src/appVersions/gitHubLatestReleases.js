// vychází z tohoto: https://github.com/welbert/latest-github-release

var https = require("https");

var options = {
	host: 'api.github.com',
	port: 443,
	method: 'GET',
	headers: {
		'Content-Type': 'application/json',
		'user-agent': 'node.js'
	}
};

function getLatestGithubRelease(owner, repository, callback) {
    options.path = '/repos/' + owner + '/' + repository + '/releases/latest';

    var req = https.request(options, function (res) {
        var output = '';
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function () {
            var json = JSON.parse(output);

            var published_date = new Date(json.published_at);

            console.log("Project: " + repository);
            console.log("Url: " + json.html_url);
            console.log("Published at: " + published_date);
            console.log("Tag: " + json.tag_name.trim());

            var result = {
                project: repository,
                url: json.html_url,
                published_at: published_date,
                tag: json.tag_name.trim()
            };

            callback(null, result);

           /* return {
                Project: repository,
                Url: json.html_url,
                PublishedAt: published_date,
                Version: json.tag_name.trim()
            };*/

        });
    });

    req.on('error', function (err) {
        console.log("Fail. Error: " + err.message);
        callback(err, null);
    });

    req.end();
}

module.exports = getLatestGithubRelease;