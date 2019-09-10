var exec = require('cordova/exec');
var cordova = require('cordova');

/**
 * Constructor
 */
const Hypergate = {
    /**
     *
     * Request valid auth token for the passed token path. 
     * Important: Do not cache the returned authToken in some way.
     *            Each API Call should request the token, otherwise it is possible that the valid expired between the App start and the actuall API Call. 
     *            The recommended way to implement it, is to use a request interceptor for each call.
     * @param string[]                        authTokenPath     Auth token paths, i.e. ['HTTP@hypergate.com']
     * @param (authToken: string) => void   successCallback   Called when Hypergate has a valid TGT, return an AuthToken
     * @param (error: string) => void       errorCallback     Called whenever Hypergate is not in possession of a valid TGT.
     */
    getToken: function (authTokenPaths, successCallback, errorCallback) {
        exec(successCallback, errorCallback, "Hypergate", "getToken", [authTokenPaths]);
    }
}

module.exports = Hypergate;
