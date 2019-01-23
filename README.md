# cognitocurl

This tool allows you to easily sign calls to API Gateway with Cognito authorization. It takes care of sign in, token refreshing and adding additional header to provided `curl` command.

## Install

`npm -i g cognitocurl`

## Usage

#### Minimum setup

`cognitocurl --cognitoclient=cognitoclient --userpool=userpool --run "full curl command here"`

#### Available flags

##### Tools:

- -v, --version
- --help

##### Features:

- --cognitoclient=cognitoclient - Cognito Client ID
- --userpool=userpool - Cognito User Pool ID
- --header=header - _Defaults to 'Authorization'_
- --reset - Reset cached Cognito credentials
- --run="runcommand" - pass your curl command here
