# cognitocurl 🔏

This is CLI tool that allows you to easily sign curl calls to API Gateway with Cognito authorization token.

## 1. Why?

AWS Cognito is really powerful, especially combined with API Gateway, but if you use Cognito Authorizer or Lambda Authorizer based on Authorization header, you may encounter a problem with signing curl calls - this is why we created `cognitocurl` - it is tiny CLI tool made with Node.js that takes care of signing in against user pool, persisting and rotating tokens, and adding additional header to your curl call.

## 2. How to install

`npm -i g cognitocurl`

## 3. How to use it

#### 3.1 Minimum

`cognitocurl --cognitoclient=XXX --userpool=YYY --run "full curl command here"`

#### 3.2 Available flags

##### 3.2.1 Tools:

- -v, --version
- --help

##### 3.2.2 Features:

- --cognitoclient=cognitoclientid - Cognito Client ID
- --userpool=userpoolid - Cognito User Pool ID
- --header=header - _Defaults to 'Authorization'_
- --reset - Reset cached Cognito credentials
- --run="runcommand" - pass your curl command here

## 4. Plans for the future

- add federated/social logins (by opening browser window)
- add hosted ui apps (by opening browser window)

## 5. Credits

Done using [oclif](https://github.com/oclif/oclif). Inspired by [AWS Amplify](https://github.com/aws-amplify/amplify-js).
