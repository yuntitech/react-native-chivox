package com.bookln.chivox;

import android.text.TextUtils;
import android.util.Log;

import com.chivox.aiengine.AudioSrc;
import com.chivox.aiengine.Engine;
import com.chivox.aiengine.EvalResult;
import com.chivox.aiengine.EvalResultListener;
import com.chivox.aiengine.RetValue;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;


/**
 * @version V1.0 <描述当前版本功能>
 * @FileName: ChivoxModule.java
 * @author: villa_mou
 * @date: 05-14:43
 * @desc
 */
public class ChivoxModule extends ReactContextBaseJavaModule implements LifecycleEventListener {
    public static final String NAME = "ChivoxModule";
    private static final String TAG = "villa";
    private ExecutorService workerThread = Executors.newFixedThreadPool(1);
    private static final String GET_CHIVOX_DATA_NOTIFICATION = "com.yunti.chivox.getChivoxDataNotification";


    private Engine mEngine;

    public ChivoxModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContext.addLifecycleEventListener(this);
    }

    @Override
    public String getName() {
        return NAME;
    }


    @Override
    public void initialize() {
        super.initialize();

    }

    @ReactMethod
    public void initChivoxSdk(final String appKey, final String SecretKey,Promise promise) {
        workerThread.execute(new Runnable() {
            @Override
            public void run() {
                if (getCurrentActivity() == null) {
                    return;
                }
                try {
                    JSONObject cfg = new JSONObject();
                    String provisionPath = AIEngineHelper.extractResourceOnce(getCurrentActivity().getApplicationContext(), "aiengine.provision", false);
                    cfg.put(Const.APP_KEY, appKey);
                    cfg.put(Const.SECRET_KEY, SecretKey);
                    cfg.put(Const.PROVISION, provisionPath);
                    JSONObject cloud = new JSONObject();
                    cloud.put("enable", 1);
                    cfg.put(Const.CLOUD, cloud);
                    Engine.create(getCurrentActivity(), cfg, new Engine.CreateCallback() {
                        @Override
                        public void onSuccess(Engine engine) {
                            mEngine = engine;
                            Log.e(TAG, "onSuccess");
                            promise.resolve(null);
                        }

                        @Override
                        public void onFail(RetValue err) {
                            promise.reject(err.errId+"",err.error);
                            Log.e(TAG, "err" + err.error);
                        }
                    });
                } catch (JSONException e) {
                }

            }
        });

    }

    @ReactMethod
    public void startChivoxRecord(final ReadableMap options, final Promise promise) {


        this.dealData(options, promise);
    }

    private void dealData(final ReadableMap options,final Promise promise) {
        workerThread.execute(new Runnable() {
            @Override
            public void run() {

                    AudioSrc.InnerRecorder innerRecorder = new AudioSrc.InnerRecorder();
                    innerRecorder.recordParam.sampleBytes = 2;
                    innerRecorder.recordParam.sampleRate = 16000;
                    // 如果需要录音自动停止的话，可设置录音时间。
//                innerRecorder.recordParam.duration = 3000;
                    // tokenId - 用于接收评测任务ID
                    StringBuilder tokenId = new StringBuilder();

                JSONObject param = null;
                try {
                    param = convertMapToJson(options);
                } catch (JSONException e) {
                    e.printStackTrace();
                }

                RetValue ret = mEngine.start(getCurrentActivity(), innerRecorder, tokenId,  param, new EvalResultListener() {

                        @Override
                        public void onError(String s, EvalResult evalResult) {
                            // 评测失败，请查看result.errId, result.error分析失败原因。
                            // 当进入这里的时候，请调用engine.cancel()接口重置engine，否则下次无法正常start。
                            Log.e(TAG, "recordonError" + evalResult.text());
                            mEngine.cancel();
                            WritableMap event = Arguments.createMap();
                            event.putString("data", evalResult.text());
                            event.putBoolean("success", false);
                            sendEvent(GET_CHIVOX_DATA_NOTIFICATION, event);
                        }

                        @Override
                        public void onEvalResult(String s, final EvalResult evalResult) {
                            Log.e(TAG, "recordEvalResult.text:" + evalResult.text());
                            WritableMap event = Arguments.createMap();
                            event.putString("data", evalResult.text());
                            event.putBoolean("success", true);
                            sendEvent(GET_CHIVOX_DATA_NOTIFICATION, event);
                        }

                        @Override
                        public void onBinResult(String s, final EvalResult evalResult) {

                        }

                        @Override
                        public void onVad(String s, final EvalResult evalResult) {

                        }

                        @Override
                        public void onSoundIntensity(String s, final EvalResult evalResult) {

                        }

                        @Override
                        public void onOther(String s, final EvalResult evalResult) {

                        }
                    });
                    if (0 != ret.errId) {
                        promise.reject(String.valueOf(ret.errId), "startChivoxRecord操作失败" + ret.error);
                    } else {
                        promise.resolve(null);
                    }
                }
        });

    }

    private static JSONArray convertArrayToJson(ReadableArray readableArray) throws JSONException {
        JSONArray array = new JSONArray();
        for (int i = 0; i < readableArray.size(); i++) {
            switch (readableArray.getType(i)) {
                case Null:
                    break;
                case Boolean:
                    array.put(readableArray.getBoolean(i));
                    break;
                case Number:
                    array.put(readableArray.getDouble(i));
                    break;
                case String:
                    array.put(readableArray.getString(i));
                    break;
                case Map:
                    array.put(convertMapToJson(readableArray.getMap(i)));
                    break;
                case Array:
                    array.put(convertArrayToJson(readableArray.getArray(i)));
                    break;
            }
        }
        return array;
    }

    private static JSONObject convertMapToJson(ReadableMap readableMap) throws JSONException {
        JSONObject object = new JSONObject();
        ReadableMapKeySetIterator iterator = readableMap.keySetIterator();
        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();
            switch (readableMap.getType(key)) {
                case Null:
                    object.put(key, JSONObject.NULL);
                    break;
                case Boolean:
                    object.put(key, readableMap.getBoolean(key));
                    break;
                case Number:
                    object.put(key, readableMap.getDouble(key));
                    break;
                case String:
                    object.put(key, readableMap.getString(key));
                    break;
                case Map:
                    object.put(key, convertMapToJson(readableMap.getMap(key)));
                    break;
                case Array:
                    object.put(key, convertArrayToJson(readableMap.getArray(key)));
                    break;
            }
        }
        return object;
    }



    public boolean isJson(String content) {
        try {
            com.alibaba.fastjson.JSONObject jsonElement = com.alibaba.fastjson.JSONObject.parseObject(content);
            return true;
        } catch (Exception e) {
            return false;
        }
    }


    /**
     * 发送通知
     *
     * @param eventName
     * @param params
     */
    private void sendEvent(
            String eventName,
            WritableMap params) {
        getReactApplicationContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }


    @ReactMethod
    public void stopChivoxRecord(Promise promise) {
        if (mEngine == null) {
            promise.reject("0", "驰声 SDK stopChivoxRecord 失败，驰声 SDK 引擎为 null");
            return;
        }
        RetValue ret = mEngine.stop();
        if (0 != ret.errId) {
            promise.reject(String.valueOf(ret.errId), "驰声 SDK stopChivoxRecord 失败: " + ret.error);
        } else {
            promise.resolve(null);
        }
    }

    /**
     * 取消驰声SDK评测
     */
    @ReactMethod
    public void cancelChivoxRecord(Promise promise) {
        if (mEngine == null) {
            promise.reject("0", "驰声 SDK stopChivoxRecord 失败，驰声 SDK 引擎为 null");
            return;
        }
        mEngine.cancel();
        promise.resolve(null);
    }


    @Override
    public void onHostResume() {

    }

    @Override
    public void onHostPause() {

    }

    @Override
    public void onHostDestroy() {
        if(mEngine!=null){
            mEngine.destroy();
        }
    }
}