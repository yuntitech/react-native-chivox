import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.concurrent.ExecutorService;
@@ -31,13 +31,12 @@ import java.util.concurrent.Executors;
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
    private static final String GET_CHIVOX_DATA_NOTIFICATION = "com.yunti.chivox.getChivoxDataNotification";

@@ -97,80 +96,127 @@ public class ChivoxModule extends ReactContextBaseJavaModule implements Lifecycl
        });

    }

    @ReactMethod
    public void startChivoxRecord(final ReadableMap options, final Promise promise) {
        Log.e(TAG, "refText" + options.getString("coreType"));
        final String coreType = options.getString("coreType");
        final String refText = options.getString("refText");
        final int attachAudioUrl = options.getInt("attachAudioUrl");
        if (getCurrentActivity() == null || TextUtils.isEmpty(coreType) || TextUtils.isEmpty(refText) || mEngine == null) {
       
        final ReadableMap request = options.getMap("request");
        final ReadableType refTextType = request.getType("refText");
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

    private void dealData(final ReadableMap options, final int attachAudioUrl, final String refText,
    private void dealData(final ReadableMap options, final int attachAudioUrl, final Object refText,
                          final String coreType, final Promise promise) {
        workerThread.execute(new Runnable() {
            @Override
            public void run() {
                // 使用内部录音模式进行评测
                JSONObject param = new JSONObject();

                try {
                    // 在线评测 or 离线评测
                    param.put("coreProvideType", "cloud");
                    if(options.hasKey("coreProvideType")){
                        final String coreProvideType=options.getString("coreProvideType");
                        param.put("coreProvideType", coreProvideType);
                    }else{
                        param.put("coreProvideType", "cloud");
                    }

                    if(options.hasKey("audioType")){
                        final String audioType=options.getString("audioType");
                        param.put("audioType", audioType);
                    }else{
                        param.put("audioType", "wav");
                    }

                    if(options.hasKey("channel")){
                        final Integer channel=options.getInt("channel");
                        param.put("channel", channel);
                    }else{
                        param.put("channel", 1);
                    }

                    if(options.hasKey("sampleBytes")){
                        final Integer sampleBytes=options.getInt("sampleBytes");
                        param.put("sampleBytes", sampleBytes);
                    }else{
                        param.put("sampleBytes", 2);
                    }

                    if(options.hasKey("sampleRate")){
                        final Integer sampleRate=options.getInt("sampleRate");
                        param.put("sampleRate", sampleRate);
                    }else{
                        param.put("sampleRate", 16000);
                    }

                    if(options.hasKey("compress")){
                        final String compress=options.getString("compress");
                        param.put("compress", compress);
                    }else{
                        param.put("compress", "speex");
                    }

                    // 在线评测 or 离线评测
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
                    JSONObject requests = new JSONObject();
                    requests.put("attachAudioUrl", attachAudioUrl);

                    request.put("coreType", coreType);
                        requests.put("refText", refText);
//

                    requests.put("coreType", coreType);

                    if (options.hasKey("rank")) {
                        final int rank = options.getInt("rank");
                    final ReadableMap request = options.getMap("request");
                    if (request.hasKey("rank")) {
                        final int rank = request.getInt("rank");
                        if (rank != 0) {
                            request.put("rank", rank);
                            requests.put("rank", rank);
                        }

                    }

                    if (options.hasKey("precision")) {
                        final int precision = options.getInt("precision");
                    if (request.hasKey("precision")) {
                        final int precision = request.getInt("precision");
                        if (precision != 0) {
                            request.put("precision", precision);
                            requests.put("precision", precision);
                        }
                    }

                    if (options.hasKey("keywords")) {
                        final ReadableArray keywords = options.getArray("keywords");
                    if (request.hasKey("keywords")) {
                        final ReadableArray keywords = request.getArray("keywords");
                        if (keywords != null) {
                            request.put("keywords", keywords.toArrayList());
                            requests.put("keywords", keywords.toArrayList());
                        }
                    }


                    param.put("request", request);
                    param.put("request", requests);

                } catch (JSONException e) {
                    promise.reject("0", "操作失败");
                    return;
                }
                // 配置录音机选项
