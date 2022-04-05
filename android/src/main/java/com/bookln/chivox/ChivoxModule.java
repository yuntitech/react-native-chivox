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
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.json.JSONException;
import org.json.JSONObject;

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
    public void initChivoxSdk(final String appKey, final String SecretKey) {
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
                        }

                        @Override
                        public void onFail(RetValue err) {
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

        final ReadableMap request = options.getMap("request");
         ReadableType refTextType =null;
        if(request.hasKey("refText")){
            refTextType = request.getType("refText");
        }
        Object  refText = null;
        if(refTextType==ReadableType.String){
            refText = request.getString("refText");
        }else  if(refTextType==ReadableType.Map){
            refText = request.getMap("refText");

        }
        String coreType = null;
        int attachAudioUrl = 0;
        if(request.hasKey("attachAudioUrl")){
            attachAudioUrl=   request.getInt("attachAudioUrl");
        }
        if(request.hasKey("coreType")){
            coreType=  request.getString("coreType");
        }

        if (getCurrentActivity() == null || TextUtils.isEmpty(coreType) || refText==null|| mEngine == null)  {
            promise.reject("0", "操作失败");
            return;
        }
        this.dealData(options, attachAudioUrl, refText, coreType, promise);
    }

    private void dealData(final ReadableMap options, final int attachAudioUrl, final Object refText,
                          final String coreType, final Promise promise) {
        workerThread.execute(new Runnable() {
            @Override
            public void run() {
                boolean finished = false;
                // 使用内部录音模式进行评测
                JSONObject param = new JSONObject();

                try {
                    // 在线评测 or 离线评测
                    if (options.hasKey("coreProvideType")) {
                        final String coreProvideType = options.getString("coreProvideType");
                        param.put("coreProvideType", coreProvideType);
                    } else {
                        param.put("coreProvideType", "cloud");
                    }

                    if (options.hasKey("audioType")) {
                        final String audioType = options.getString("audioType");
                        param.put("audioType", audioType);
                    } else {
                        param.put("audioType", "wav");
                    }

                    if (options.hasKey("channel")) {
                        final Integer channel = options.getInt("channel");
                        param.put("channel", channel);
                    } else {
                        param.put("channel", 1);
                    }

                    if (options.hasKey("sampleBytes")) {
                        final Integer sampleBytes = options.getInt("sampleBytes");
                        param.put("sampleBytes", sampleBytes);
                    } else {
                        param.put("sampleBytes", 2);
                    }

                    if (options.hasKey("sampleRate")) {
                        final Integer sampleRate = options.getInt("sampleRate");
                        param.put("sampleRate", sampleRate);
                    } else {
                        param.put("sampleRate", 16000);
                    }

                    if (options.hasKey("compress")) {
                        final String compress = options.getString("compress");
                        param.put("compress", compress);
                    } else {
                        param.put("compress", "speex");
                    }

                    // 在线评测 or 离线评测
                    // 设置音频属性，要与实际音频匹配,比选


                    // 内核请求参数
                    JSONObject requests = new JSONObject();
                    requests.put("attachAudioUrl", attachAudioUrl);
                    requests.put("refText", refText);
                    requests.put("coreType", coreType);

                    final ReadableMap request = options.getMap("request");
                    if (request.hasKey("rank")) {
                        final int rank = request.getInt("rank");
                        if (rank != 0) {
                            requests.put("rank", rank);
                        }

                    }

                    if (request.hasKey("precision")) {
                        final int precision = request.getInt("precision");
                        if (precision != 0) {
                            requests.put("precision", precision);
                        }
                    }

                    if (request.hasKey("keywords")) {
                        final ReadableArray keywords = request.getArray("keywords");
                        if (keywords != null) {
                            requests.put("keywords", keywords.toArrayList());
                        }
                    }

                    param.put("request", requests);

                } catch (JSONException e) {
                    promise.reject("0", "操作失败");
                    finished = true;
                }
                if (!finished) {// 配置录音机选项
                    AudioSrc.InnerRecorder innerRecorder = new AudioSrc.InnerRecorder();
                    innerRecorder.recordParam.sampleBytes = 2;
                    innerRecorder.recordParam.sampleRate = 16000;
                    // 如果需要录音自动停止的话，可设置录音时间。
//                innerRecorder.recordParam.duration = 3000;
                    // tokenId - 用于接收评测任务ID
                    StringBuilder tokenId = new StringBuilder();
                    RetValue ret = mEngine.start(getCurrentActivity(), innerRecorder, tokenId, param, new EvalResultListener() {

                        @Override
                        public void onError(String s, EvalResult evalResult) {
                            // 评测失败，请查看result.errId, result.error分析失败原因。
                            // 当进入这里的时候，请调用engine.cancel()接口重置engine，否则下次无法正常start。
                            Log.e(TAG, "recordonError" + evalResult.text());
                            mEngine.cancel();
                            WritableMap event = Arguments.createMap();
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
                        promise.reject(String.valueOf(ret.errId), "操作失败");
                    } else {
                        promise.resolve(null);
                    }
                }
            }
        });

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