package com.hypergate.cordovaplugin;

import android.accounts.Account;
import android.accounts.AccountManager;
import android.app.Activity;
import android.content.Intent;
import android.util.Log;
import org.json.JSONArray;
import org.json.JSONException;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;

import kotlin.Unit;
import kotlin.jvm.functions.Function1;
import com.hypergate.sdk.Hypergate;
import com.hypergate.sdk.HypergateException;


public class HypergateCordovaPlugin extends CordovaPlugin {

    private static final String TAG = "HypergateCordovaPlugin";

    @Override
    protected void pluginInitialize() {
        super.pluginInitialize();
    }

    public boolean execute(String action, JSONArray data, final CallbackContext callbackContext) throws JSONException {
        try {
            if (action.equals("getToken")) {
                final String authTokenPath = data.getString(0);
                if(authTokenPath == null){
                    callbackContext.error("No auth token path defined");
                    return true;
                }
               
                Hypergate.Companion.requestTokenAsync(this.cordova.getActivity(), "SPNEGO:HOSTBASED:" + authTokenPath,
                        new Function1<String, Unit>() {
                            @Override
                            public Unit invoke(String negotiateToken) {
                                callbackContext.success(negotiateToken);
                                return Unit.INSTANCE;
                            }
                        },
                        new Function1<Exception, Unit>() {
                            @Override
                            public Unit invoke(Exception exception) {
                                callbackContext.error(exception.getMessage());
                                return Unit.INSTANCE;
                            }
                        });
              
                return true;
            }
        } catch (Exception exception) {
            Log.e(TAG, exception.getMessage(), exception);
            callbackContext.error(exception.getMessage());
        }
        return false;
    }
}
