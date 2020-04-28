# cognitocurl 🔏

![](preview.gif)

This is CLI tool that allows you to easily sign curl calls to API Gateway with Cognito authorization token.

[![npm version](https://badge.fury.io/js/cognitocurl.svg)](https://badge.fury.io/js/cognitocurl)

## Why?

AWS Cognito is really powerful, especially combined with API Gateway, but if you use Cognito Authorizer or Lambda Authorizer based on Authorization header, you may encounter a problem with signing curl calls - this is why we created `cognitocurl` - it is tiny CLI tool made with Node.js that takes care of signing in against user pool, persisting and rotating tokens, and adding additional header to your curl call.

Made with ❤️ in Nordcloud

## Usage

Installation:

```
$ npm i -g cognitocurl
```

Then:

```
$ cognitocurl --cognitoclient XXX --userpool YYY --run "full curl command here"
```

or

```
$ cognitocurl --hostedui hosteduisetupfilename.json --run "full curl command here"
```

Getting access token with a single command
```
$ cognitocurl --cognitoclient CLIENT_ID --userpool USER_POOL_ID --token --username USER_NAME --password USER_PASSWORD
``` 

## Available flags

### Tools:

- `--version`
- `--help`

### Features:

- `--cognitoclient cognitoclientid` - Cognito Client ID
- `--userpool userpoolid` - Cognito User Pool ID
- `--header header` - _Defaults to 'Authorization'_
- `--reset` - Reset cached Cognito credentials
- `--run "runcommand"` - pass your curl command here
- `--hostedui hostedui.json` - if passed, Congito Hosted UI will be launched and configured using setup from provided json file
- `--token` - if passed, run command will be ignored and access token will be printed to stdout instead
- `--username` - if not passed, you will be prompted to enter a username (added to cli authentication)
- `--password` - if not passed, you will be prompted to enter a password (added to cli authentication)

#### Hosted UI json setup example

If you want to use hosted ui, provide `--hostedui`. You should provide a setup jsonfile file like this:

```
{
  "region": "eu-west-1",
  "userPoolId": "your_user_pool_id",
  "userPoolWebClientId": "your_web_client_id",
  "redirectSignIn": "http://localhost:3000",
  "redirectSignOut": "http://localhost:3000",
  "domain": "your_hosted_ui_domain"
}
```

**Note that `lochalhost:3000` should be added to your Cognito User Pool App Client setup!**

## Plans for the future

- add federated/social logins (by opening browser window)

## Authors

- Jakub Holak, Nordcloud 🇵🇱

## Credits

Done using [oclif](https://github.com/oclif/oclif). Inspired by [AWS Amplify](https://github.com/aws-amplify/amplify-js).
