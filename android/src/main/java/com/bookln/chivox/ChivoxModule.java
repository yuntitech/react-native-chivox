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
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;
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
@ReactModule(name = ChivoxModule.NAME)
public class ChivoxModule extends ReactContextBaseJavaModule implements LifecycleEventListener {
    public static final String NAME = "ChivoxModule";
    private static final String TAG = "villa";
    private ExecutorService workerThread = Executors.newFixedThreadPool(1);
    private static final String GET_CHIVOX_DATA_NOTIFICATION = "cn.bookln.oneClickLogin.getChivoxDataNotification";


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
        Log.e(TAG, "refText" + options.getString("coreType"));
        final String coreType = options.getString("coreType");
        final String refText = options.getString("refText");
        final int attachAudioUrl = options.getInt("attachAudioUrl");
        if (getCurrentActivity() == null || TextUtils.isEmpty(coreType) || TextUtils.isEmpty(refText) || mEngine == null) {
            promise.reject("0", "操作失败");
            return;
        }
        this.dealData(options, attachAudioUrl, refText, coreType, promise);
    }

    private void dealData(final ReadableMap options, final int attachAudioUrl, final String refText,
                          final String coreType, final Promise promise) {
        workerThread.execute(new Runnable() {
            @Override
            public void run() {
                // 使用内部录音模式进行评测
                JSONObject param = new JSONObject();
                try {
                    // 在线评测 or 离线评测
                    param.put("coreProvideType", "cloud");
                    // 设置音频属性，要与实际音频匹配,比选
                    JSONObject audio = new JSONObject();
                    audio.put("audioType", "wav");
                    audio.put("channel", 1);
                    audio.put("sampleBytes", 2);
                    audio.put("sampleRate", 16000);
                    // 上传音频时是否采用压缩
                    audio.put("compress", "speex");
                    param.put("audio", audio);

                    // 内核请求参数
                    JSONObject request = new JSONObject();
                    request.put("attachAudioUrl", attachAudioUrl);
                    if (isJson(refText)) {
                        JSONObject jsonObj = new JSONObject(refText);
                        request.put("refText", jsonObj);
                    } else {
                        request.put("refText", refText);
                    }

                    request.put("coreType", coreType);


                    if (options.hasKey("rank")) {
                        final int rank = options.getInt("rank");
                        if (rank != 0) {
                            request.put("rank", rank);
                        }

                    }

                    if (options.hasKey("precision")) {
                        final int precision = options.getInt("precision");
                        if (precision != 0) {
                            request.put("precision", precision);
                        }
                    }

                    if (options.hasKey("keywords")) {
                        final ReadableArray keywords = options.getArray("keywords");
                        if (keywords != null) {
                            request.put("keywords", keywords.toArrayList());
                        }
                    }


                    param.put("request", request);

                } catch (JSONException e) {
                    promise.reject("0", "操作失败");
                    return;
                }
                // 配置录音机选项
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
            promise.reject("0", "操作失败");
            return;
        }
        RetValue ret = mEngine.stop();
        if (0 != ret.errId) {
            promise.reject(String.valueOf(ret.errId), "操作失败");
        } else {
            promise.resolve(null);
        }
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
