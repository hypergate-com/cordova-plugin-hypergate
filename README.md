Hypergate Cordova Plugin
======

Add this plugin to your Cordova project to authenticate against Kerberos-protected services on
Android through [Hypergate Authenticator](https://hypergate.com/authenticator-sso/). Under the
hood it uses the [Hypergate SDK](https://github.com/hypergate-com/hypergate-sdk)
(`com.hypergate:sdk` on Maven Central).

For the full integration story, including how this fits into the NTLM deprecation, see:
[Moving Your Android App off NTLM: Kerberos SSO with the Hypergate SDK](https://hypergate.com/blog/android-kerberos-sso-ntlm-sdk/).

# Requirements

- Android platform (`cordova-android`)
- A device managed by an MDM/EMM/UEM ([supported EMMs](https://hypergate.com/supported-emms/))
  with Hypergate Authenticator deployed

# Installation

```bash
cordova plugin add cordova-plugin-hypergate
```

# Usage

After you include this plugin, your application exposes new managed configurations:

- **Account type for HTTP Negotiate authentication**: which account type your WebView looks for
  whenever there is an authentication challenge. This should be set to `ch.papers.hypergate`.
- **Authentication server allowlist**: which servers are allowed to request authentication
  tokens from Hypergate. Either a wildcard (`*`) or the domains you want to enable.
- **Whether NTLMv2 authentication is enabled**: a WebView fallback toggle that has nothing to do
  with Hypergate itself. Leave it disabled if you want an NTLM-free app.

Once these options are configured in your MDM/EMM/UEM (the thing that pushes restrictions, also
known as managed configurations), the WebView deals with all AJAX and native requests on its own,
transparently from your app. All your requests are authenticated automatically.

Note: if you do not use standard AJAX requests and have a native plugin performing requests
instead, use the "Advanced usage" below.

# Advanced usage

Advanced usage comes in handy whenever you want to handle the token yourself. To request a token,
call `Hypergate.getToken(authTokenPath, success, error)` with the service principal of your
backend:

```javascript
window.Hypergate.getToken('HTTP@securedbackend.com', (token) => {
    console.log(token);
}, (error) => {
    console.error(error);
});
```

The token goes into the `Authorization` header as `Negotiate <token>`.

If you are using TypeScript, you probably have to declare the window variable first:

`declare var window: any;`

# Important

Do not cache the returned token. Request a fresh token for each API call, otherwise the token may
have expired between app start and the actual call. The recommended pattern is a request
interceptor that fetches the token per request.

# Sample app

A complete runnable example lives at
[hypergate-cordova-sample](https://github.com/hypergate-com/hypergate-cordova-sample).
