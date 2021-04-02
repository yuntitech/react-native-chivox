#import "RNChivox.h"
#import "CAIEngine.h"

static NSString *const ChivoxEventNotification = @"cn.bookln.oneClickLogin.getChivoxDataNotification";

@interface RNChivox()
@property (nonatomic, nullable)ChivoxAIEngine *cloudengine;
@end

@implementation RNChivox

RCT_EXPORT_MODULE(ChivoxModule)

- (NSArray<NSString *> *)supportedEvents {
  return @[ChivoxEventNotification];
}

RCT_EXPORT_METHOD(initChivoxSdk:(NSString *)appKey
                  secretKey:(NSString *)secretKey) {
  // 构建配置信息
  NSMutableDictionary *cfg = [[NSMutableDictionary alloc] init]; //设置传入参数
  NSMutableDictionary *cloud = [[NSMutableDictionary alloc] init];//设置cloud参数
  //授权信息
  [cfg setObject:appKey forKey:@"appKey"];
  [cfg setObject:secretKey forKey:@"secretKey"];
  NSString * provision = [[NSBundle mainBundle] pathForResource:@"aiengine" ofType:@"provision"];
  [cfg setObject:provision forKey:@"provision"];
  //网络连接
  [cloud setObject:@1 forKey:@"enable"];
  //传入参数为nsnumber类型，是@0，不是@"0"
  [cloud setObject:@1 forKey:@"protocol"];
  [cloud setObject:@5 forKey:@"connectTimeout"];
  [cloud setObject:@10 forKey:@"serverTimeout"];
  //初始化网络信息
  cfg[@"cloud"] = cloud;
  //引擎回调
  ChivoxAIEngineCreateCallback *cb = [ChivoxAIEngineCreateCallback
                                      onSuccess:^(ChivoxAIEngine * _Nonnull engine) {
    self.cloudengine = engine;
    
  } onFail:^(ChivoxAIRetValue * _Nonnull err) {}];
  //初始化
  [ChivoxAIEngine create:cfg cb:cb];
  //设置AVAudioSession Category为可录音的选项
  AVAudioSession* sharedSession = [AVAudioSession sharedInstance];
  [sharedSession setCategory:AVAudioSessionCategoryRecord error:nil];
}

RCT_EXPORT_METHOD(startChivoxRecord:(nonnull NSDictionary *)options
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
  if(nil == self.cloudengine){
    reject(@"0",@"chivox初始化失败", nil);
  }
  
  NSString *coreType = options[@"coreType"];
  NSString *refText = options[@"refText"];
  NSNumber *attachAudioUrl = options[@"attachAudioUrl"];
  if(!coreType || coreType.length == 0 || !refText || refText.length ==0 || !attachAudioUrl){
    reject(@"0",@"操作失败", nil);
    return;
  }
  //创建监听对象
  ChivoxAIEvalResultListener *handler = [[ChivoxAIEvalResultListener alloc] init];
  //完成的结果回调
  handler.onEvalResult = ^(NSString * _Nonnull eval, ChivoxAIEvalResult *
                           _Nonnull result) {
    NSLog(@"result:%@ path:%@",result.text,result.recFilePath);
    if (result.text == nil) {
      reject(@"0",@"返回结果空！！！", nil);
      return;
    }
    NSDictionary *body = @{@"data":result.text,@"success":@(true)};
    [self sendEventWithName:ChivoxEventNotification body:body];
  };
  //错误回调
  handler.onError = ^(NSString * _Nonnull eval, ChivoxAIEvalResult *
                      _Nonnull result) {
    NSDictionary *body = @{@"data":@"onError:----",@"success":@(false)};
    [self sendEventWithName:ChivoxEventNotification body:body];
  };
  //创建音频源
  ChivoxAIInnerRecorder *innerRecorder = [[ChivoxAIInnerRecorder alloc] init];
  innerRecorder.recordParam.channel = 1;
  innerRecorder.recordParam.sampleRate = 16000;
  innerRecorder.recordParam.sampleBytes = 2;
  //获取本地播放文件路径
  NSString *device_id = [ChivoxAIEngine getDeviceId];
  NSString *filename = [[NSString alloc] initWithFormat:@"%@/Documents/record/%@.wav",NSHomeDirectory(),device_id];
  innerRecorder.recordParam.saveFile = filename;
  //创建测评参数
  NSMutableDictionary *param = [[NSMutableDictionary alloc] init];
  NSMutableDictionary *audio = [[NSMutableDictionary alloc] init];
  [param setObject:@1 forKey:@"soundIntensityEnable"];
  [param setObject:@"cloud" forKey:@"coreProvideType"];
  
  [audio setObject:@"wav" forKey:@"audioType"];
  [audio setObject:@16000 forKey:@"sampleRate"];
  [audio setObject:@2 forKey:@"sampleBytes"];
  [audio setObject:@1 forKey:@"channel"];
  
  param[@"audio"] = audio;
  param[@"soundIntensityEnable"] = @0;
  
  NSMutableDictionary *request =  [[NSMutableDictionary alloc] init];
  [request setObject:@100 forKey:@"rank"];
  [request setObject:refText forKey:@"refText"];
  [request setObject:coreType forKey:@"coreType"];
  [request setObject:attachAudioUrl forKey:@"attachAudioUrl"];
  [param setObject:request forKey:@"request"];
  param[@"coreProvideType"] = @"cloud";
  
  ChivoxAIRetValue * e  = nil;
  [ChivoxAIRecorderNotify sharedInstance].onRecordStart = ^{
    NSLog(@"start recorder");
  };
  [ChivoxAIRecorderNotify sharedInstance].onRecordStop = ^{
    NSLog(@"stop recorder");
  };
  
  NSMutableString *tokenid = [[NSMutableString alloc] init];
  e = [self.cloudengine start:innerRecorder tokenId:tokenid param:param listener:handler]; //开始评测
  if (0 != [e errId]){
    reject(@([e errId]).stringValue,@"startChivoxRecord操作失败", nil);
  }else{
    resolve(nil);
  }
}

RCT_EXPORT_METHOD(stopChivoxRecord:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  if(self.cloudengine == nil){
    reject(@"0",@"stopChivoxRecord操作失败", nil);
    return;
  }
  ChivoxAIRetValue * e  = nil;
  e = [self.cloudengine stop];
  if (0 != [e errId]){
    reject(@([e errId]).stringValue,@"stopChivoxRecord操作失败", nil);
  }else{
    resolve(nil);
  }
  
}

@end
