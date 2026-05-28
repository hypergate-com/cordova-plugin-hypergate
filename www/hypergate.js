var exec = require('cordova/exec');
var cordova = require('cordova');

/**
 * Constructor
 */
const Hypergate = {
    /**
     * Request a valid auth token for the passed service principal.
     * Important: Do not cache the returned authToken. Request a fresh token
     *            for each API call, otherwise the token may have expired
     *            between app start and the actual call. The recommended
     *            pattern is a request interceptor that fetches the token
     *            per request.
     * @param string                       authTokenPath     Service principal, e.g. 'HTTP@securedbackend.com'
     * @param (authToken: string) => void  successCallback   Called with the negotiate token when Hypergate has a valid TGT
     * @param (error: string) => void      errorCallback     Called whenever Hypergate is not in possession of a valid TGT
     */
    getToken: function (authTokenPath, successCallback, errorCallback) {
        exec(successCallback, errorCallback, "Hypergate", "getToken", [authTokenPath]);
    }
}

module.exports = Hypergate;
