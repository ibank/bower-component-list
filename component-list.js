/*jshint camelcase:false */
'use strict';
var request = require('request');
var Q = require('q');

var REGISTRY_URL = 'https://bower.herokuapp.com/packages';

function createComponentData(name, data) {
	return {
		name: name,
		description: data.description,
		owner: data.owner.login,
		website: data.html_url,
		forks: data.forks,
		stars: data.watchers,
		created: data.created_at,
		updated: data.updated_at
	};
}

function fetchComponents() {
	return Q.fcall(function () {
		var deferred = Q.defer();
		request.get(REGISTRY_URL, {json: true}, function(err, response, body) {
			if (!err && response.statusCode === 200) {
				deferred.resolve(body);
			} else {
				deferred.reject(new Error(err));
			}
		});
		return deferred.promise;
	}).then(function (list) {
		var results = list.map(function (el) {
			var deferred = Q.defer();
			var re = /github\.com\/([\w\-\.]+)\/([\w\-\.]+)/i;
			var parsedUrl = re.exec(el.url.replace(/\.git$/, ''));

			// only return components from github
			if (!parsedUrl) {
				deferred.resolve();
				return deferred.promise;
			}

			var user = parsedUrl[1];
			var repo = parsedUrl[2];
			var apiUrl = 'https://api.github.com/repos/' + user + '/' + repo;

			request.get(apiUrl, {
				json: true,
				qs: {
					client_id: process.env.GITHUB_CLIENT_ID,
					client_secret: process.env.GITHUB_CLIENT_SECRET
				}
			}, function (err, response, body) {
				if (!err && response.statusCode === 200) {
					deferred.resolve(createComponentData(el.name, body));
				} else {
					if (response.statusCode === 404) {
						// uncomment to get a list of registry items pointing
						// to non-existing repos
						//console.log(el.name + '\n' + el.url + '\n');

						// don't fail just because the repo doesnt exist
						// instead just return `undefined` and filter it out later
						deferred.resolve();
					} else {
						deferred.reject(new Error(err));
					}
				}
				return deferred.promise;
			});
			return deferred.promise;
		});

		console.log('Finished fetching data from Bower registry', '' + new Date());
		return Q.all(results);
	});
}

module.exports = fetchComponents;
