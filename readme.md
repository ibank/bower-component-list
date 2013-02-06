# bower-component-list

Aggregated list of components from the [Bower registry](https://bower.herokuapp.com/packages) and GitHub metadata.

Currently used as the back-end for the [Bower components site](https://github.com/sindresorhus/bower-components).


### Getting Started

- [Register a new OAuth app](https://github.com/settings/applications/new) on GitHub. This is needed since GitHub allows more API usage for registered apps.

- Set the environment variables `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` from your newly created app. Remember set the `NODE_ENV` to `production` when you deploy.

- Run `node server.js && open http://localhost:8011`

You can change the port by setting the `PORT` environment variable.


## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
(c) [Sindre Sorhus](http://sindresorhus.com)
