# Hypergate Cordova Plugin

Kerberos single sign-on for Cordova apps on Android through
[Hypergate Authenticator](https://hypergate.com/authenticator-sso/). This plugin wraps the
[Hypergate SDK](https://github.com/hypergate-com/hypergate-sdk) (`com.hypergate:sdk` on Maven
Central) so your app can authenticate against Kerberos-protected services without passwords or NTLM.

If you are planning a migration away from NTLM, start with the blog post
[Moving Your Android App off NTLM: Kerberos SSO with the Hypergate SDK](https://hypergate.com/blog/android-kerberos-sso-ntlm-sdk/).
It covers the full integration story that this plugin implements for Cordova.

## How it works

[Hypergate Authenticator](https://hypergate.com/authenticator-sso/) holds the user's Kerberos
credentials (TGT) on the device. Your app never sees a password: it asks Hypergate for a
SPNEGO/Negotiate token for a given service principal (SPN) and attaches it to the request. For
WebView traffic this happens transparently once the managed configurations below are set:
the WebView authenticates every AJAX and navigation request automatically.

## Requirements

- `cordova-android` (the plugin is Android-only; other platforms are unaffected)
- A device managed by an MDM/EMM/UEM ([supported EMMs](https://hypergate.com/supported-emms/))
  with [Hypergate Authenticator](https://hypergate.com/authenticator-sso/) deployed

## Installation

```bash
cordova plugin add cordova-plugin-hypergate
```

## Managed configuration

Adding the plugin exposes managed configurations (app restrictions) on your app. Configure them
in your MDM/EMM/UEM:

| Managed configuration | Value |
|---|---|
| Account type for HTTP Negotiate authentication | `ch.papers.hypergate` |
| Authentication server allowlist | `*` or an explicit list of domains allowed to request tokens |
| Whether NTLMv2 authentication is enabled | WebView NTLM fallback, unrelated to Hypergate; leave it disabled if you want an NTLM-free app |

In addition, your app's package name must be on the discoverability list in the Hypergate
Authenticator managed configuration, otherwise token requests fail with error 101.

With these in place the WebView authenticates all requests on its own; most apps need no code
at all.

## Advanced usage: requesting tokens manually

If you perform requests outside the WebView (for example through a native HTTP plugin), request
the Negotiate token yourself with the service principal of your backend:

```javascript
window.Hypergate.getToken('HTTP@securedbackend.com', (token) => {
    // attach to your request:
    // headers: { 'Authorization': 'Negotiate ' + token }
}, (error) => {
    // no valid TGT, device not managed, or app not on the discoverability list
});
```

With TypeScript, declare the window first: `declare var window: any;`

Do not cache the token. Request a fresh one for every API call, because a cached token may
have expired between app start and the actual request. The recommended pattern is a request
interceptor that fetches a token per request.

## API

### `Hypergate.getToken(servicePrincipal, success, error)`

| Parameter | Type | Description |
|---|---|---|
| `servicePrincipal` | `string` | SPN of the target service, e.g. `HTTP@securedbackend.com` |
| `success` | `(token: string) => void` | Called with the raw Negotiate token |
| `error` | `(error: string) => void` | Called when no valid token could be obtained |

## Troubleshooting

- Error 101 ("no accounts found"): the app's package name is missing from the
  discoverability list, or the device has no Hypergate account at all.
- Token issued but the backend returns 401: verify the SPN matches the backend's service
  principal and that the account has AES key material (see
  [Kerberos RC4 removal](https://hypergate.com/blog/kerberos-rc4-removal-mobile-sso/)).
- Nothing happens in the WebView: check that the account type managed configuration is set
  to `ch.papers.hypergate` and the server is covered by the allowlist.

## Sample app

A complete runnable example lives at
[hypergate-cordova-sample](https://github.com/hypergate-com/hypergate-cordova-sample).

## License

MIT, see [LICENSE](LICENSE). Questions go to [support@hypergate.com](mailto:support@hypergate.com).
