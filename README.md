# cognitocurl 🔏
This is CLI tool that allows you to easily sign curl calls to API Gateway with Cognito authorization token.

[![npm version](https://badge.fury.io/js/cognitocurl.svg)](https://badge.fury.io/js/cognitocurl)

## Why?
AWS Cognito is really powerful, especially combined with API Gateway, but if you use Cognito Authorizer or Lambda Authorizer based on Authorization header, you may encounter a problem with signing curl calls - this is why we created `cognitocurl` - it is tiny CLI tool made with Node.js that takes care of signing in against user pool, persisting and rotating tokens, and adding additional header to your curl call.

Made with ❤️ in Nordcloud

## Usage
Installation: 
```
$ npm -i g cognitocurl
```

Then:
```
$ cognitocurl --cognitoclient=XXX --userpool=YYY --run "full curl command here"
```

## Available flags
### Tools:
- `--version`
- `--help`

### Features:
- `--cognitoclient=cognitoclientid` - Cognito Client ID
- `--userpool=userpoolid` - Cognito User Pool ID
- `--header=header` - _Defaults to 'Authorization'_
- `--reset` - Reset cached Cognito credentials
- `--run="runcommand"` - pass your curl command here

## Plans for the future
- add federated/social logins (by opening browser window)
- add hosted ui apps (by opening browser window)

## Authors
- Jakub Holak, Nordcloud 🇵🇱

## Credits
Done using [oclif](https://github.com/oclif/oclif). Inspired by [AWS Amplify](https://github.com/aws-amplify/amplify-js).
