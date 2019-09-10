Hypergate Cordova Plugin
======

Add this plugin to your Cordova project in order to authenticate through the hypergate Android application.

# Installation

To install the plugin use:

```bash
cordova plugin add cordova-plugin-hypergate 
```

# Usage

After you included this plugin, your application will receive new managed configurations:

- Account type for HTTP Negotiate authentication: this controls which account type your webview will be looking for whenever there is an authentication challenge. This should be set to 'ch.papers.hypergate'
- Authentication server whitelist: this controls which servers are allowed to request authentication tokens from hypergate. This can be either a wildcard (*) or the domains you want to enable
- Whether NTLMv2 authentication is enabled: the title is self explenatory and actually has nothing to do with Hypergate.

After you configured the options in your MDM/EMM/UEM (thing that pushes restrictions aka managed configurations) the webview will deal with all ajax and native requests on its own transparently from your app. This means all your requests will be authenticated automagically. 

Note: If you decide not to use the standard ajax request and have a native plugin to perform requests, you will need to go with the "Advanced Usage" below.

# Advanced Usage

The advanced usages comes in handy whenever you want to deal with the token yourself. To receive or request a token, just call `Hypergate.getToken(authTokenPaths, success, error)`

```javascript
window.Hypergate.getToken(['HTTP@securedbackend.com'], (token) => {
	console.log(token);
    }, (error) => {
    console.error(error);
});
```

If you are using TypeScript, you probably have to declare the window variable first:

`declare var window: any;`


# Important

Do not cache the returned authToken in some way. Each API Call should request the token, otherwise it is possible that the valid expired between the App start and the actuall API Call. The recommended way to implement it, is to use a request interceptor for each call.
