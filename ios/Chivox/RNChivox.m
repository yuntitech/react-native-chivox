#import "RNChivox.h"
#import "CAIEngine.h"

static NSString *const ChivoxEventNotification = @"com.yunti.chivox.getChivoxDataNotification";

NSString *const kCoreType = @"coreType";
NSString *const kRefText = @"refText";
NSString *const kAttachAudioUrl = @"attachAudioUrl";
NSString *const kKeywords = @"keywords";
NSString *const kRank = @"rank";
NSString *const kPrecision = @"precision";
NSString *const kSoundIntensityEnable = @"soundIntensityEnable";
NSString *const kCloud = @"cloud";
NSString *const kCoreProvideType = @"coreProvideType";
NSString *const kAudioType = @"audioType";
NSString *const kSampleRate = @"sampleRate";
NSString *const kSampleBytes = @"sampleBytes";
NSString *const kChannel = @"channel";
NSString *const kAudio = @"audio";
NSString *const kWav = @"wav";
NSString *const kRequest = @"request";
NSString *const kAppKey = @"appKey";
NSString *const kSecretKey = @"secretKey";
NSString *const kProvision = @"provision";
NSString *const kEnable = @"enable";
NSString *const kProtocol = @"protocol";
NSString *const kConnectTimeout = @"connectTimeout";
NSString *const kServerTimeout = @"serverTimeout";

#ifdef DEBUG
#   define NSLog(...) NSLog(__VA_ARGS__)
#else
#   define NSLog(...) (void)0
#endif

@interface RNChivox()
@property (nonatomic, nullable)ChivoxAIEngine *cloudengine;
@property(nonatomic, assign) AVAudioSessionCategory lastCategory;
@end

@implementation RNChivox

RCT_EXPORT_MODULE(ChivoxModule)

- (NSArray<NSString *> *)supportedEvents {
  return @[ChivoxEventNotification];
}

RCT_EXPORT_METHOD(initChivoxSdk:(NSString *)appKey
                  secretKey:(NSString *)secretKey
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
  self.lastCategory = [[AVAudioSession sharedInstance] category];
  
  // 构建配置信息
  NSMutableDictionary *cfg = [[NSMutableDictionary alloc] init]; //设置传入参数
  NSMutableDictionary *cloud = [[NSMutableDictionary alloc] init];//设置cloud参数
  
  // 授权信息
  [cfg setObject:appKey forKey:kAppKey];
  [cfg setObject:secretKey forKey:kSecretKey];
  NSString * provision = [[NSBundle mainBundle] pathForResource:@"aiengine" ofType:@"provision"];
  [cfg setObject:provision forKey:kProvision];
  
  // 网络连接
  [cloud setObject:@1 forKey:kEnable];
  
  // 传入参数为nsnumber类型，是@0，不是@"0"
  [cloud setObject:@1 forKey:kProtocol];
  [cloud setObject:@5 forKey:kConnectTimeout];
  [cloud setObject:@10 forKey:kServerTimeout];
  
  // 初始化网络信息
  cfg[@"cloud"] = cloud;
  
  // 引擎回调
  ChivoxAIEngineCreateCallback *cb = [ChivoxAIEngineCreateCallback
                                      onSuccess:^(ChivoxAIEngine * _Nonnull engine) {
    self.cloudengine = engine;
    resolve(nil);
  } onFail:^(ChivoxAIRetValue * _Nonnull err) {
    NSString *errorMessage = err.error;
    if (errorMessage == nil) {
      errorMessage = @"驰声SDK初始化失败";
    }
    reject(@([err errId]).stringValue, errorMessage, nil);
  }];
  
  // 初始化
  [ChivoxAIEngine create:cfg cb:cb];
}

RCT_EXPORT_METHOD(startChivoxRecord:(nonnull NSDictionary *)options
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
  if(nil == self.cloudengine){
    reject(@"0",@"chivox初始化失败", nil);
    return;
  }
  
  if (options == nil) {
    reject(@"0",@"操作失败", nil);
    return;
  }
  
  // 创建监听对象
  ChivoxAIEvalResultListener *handler = [[ChivoxAIEvalResultListener alloc] init];
  // 完成的结果回调
  handler.onEvalResult = ^(NSString * _Nonnull eval, ChivoxAIEvalResult *_Nonnull result) {
    NSLog(@"result:%@ path:%@", result.text, result.recFilePath);
    if (result.text == nil) {
      reject(@"0",@"返回结果空", nil);
      return;
    }
    NSDictionary *body = @{ @"data":result.text, @"success":@(true) };
    [self sendEventWithName:ChivoxEventNotification body:body];
  };
  
  // 错误回调
  handler.onError = ^(NSString * _Nonnull eval, ChivoxAIEvalResult *_Nonnull result) {
    [[AVAudioSession sharedInstance] setCategory:self.lastCategory error:nil];
    NSDictionary *body = @{ @"data": [NSString stringWithFormat:@"onError -- %@", result.text], @"success":@(false) };
    [self sendEventWithName:ChivoxEventNotification body:body];
  };
  
  ChivoxAIRetValue * e  = nil;
  [ChivoxAIRecorderNotify sharedInstance].onRecordStart = ^{
    NSLog(@"start recorder");
  };
  [ChivoxAIRecorderNotify sharedInstance].onRecordStop = ^{
    NSLog(@"stop recorder");
    [[AVAudioSession sharedInstance] setCategory:self.lastCategory error:nil];
  };
  
  ChivoxAIInnerRecorder *recorder = [self createInnerRecorder];
  NSMutableString *tokenid = [[NSMutableString alloc] init];
  
  // Remember last category
  self.lastCategory = [[AVAudioSession sharedInstance] category];
  
  // fix: The recorder failed to turn on: AVAudioSession is AVAudioSessionCategoryPlayback
  [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryRecord error:nil];
  
  // 开始评测
  e = [self.cloudengine start:recorder tokenId:tokenid param:options.mutableCopy listener:handler];
  NSLog(@"%@",options);
  if (0 != [e errId]){
    [[AVAudioSession sharedInstance] setCategory:self.lastCategory error:nil];
    NSString *errorResult = [NSString stringWithFormat:@"startChivoxRecord操作失败: %@", [e error]];
    reject(@([e errId]).stringValue,errorResult, nil);
  } else {
    resolve(nil);
  }
}

/// http://doc.api.chivox.com/opendoc/#/sdkDoc/iOS-sdk?id=_25评测请求参数说明
- (nullable NSMutableDictionary *)createParametersWithOptions:(NSDictionary *)options {
  NSString *coreType = options[kCoreType];
  NSString *refText = options[kRefText];
  NSNumber *attachAudioUrl = options[kAttachAudioUrl];
  NSArray<NSString *> *keywords = options[kKeywords];
  NSNumber *rank = options[kRank];
  NSNumber *precision = options[kPrecision];
  if(!coreType || coreType.length == 0 || !refText || refText.length ==0 || !attachAudioUrl){
    return nil;
  }

  // 创建测评参数
  NSMutableDictionary *parameters = [[NSMutableDictionary alloc] init];
  parameters[kCoreProvideType] = kCloud;
  
  NSDictionary *audio = [self createAudioParameters];
  parameters[kAudio] = audio;
  
  NSMutableDictionary *request =  [[NSMutableDictionary alloc] init];
  
  NSData *refTextData = [refText dataUsingEncoding:NSUTF8StringEncoding];
  id refTextJSON = nil;
  if (refTextData) {
    refTextJSON = [NSJSONSerialization JSONObjectWithData:refTextData options:0 error:nil];
  }
  id refTextValue = refTextJSON ? refTextJSON : refText;
  [request setValue:refTextValue forKey:kRefText];
  
  [request setValue:@100 forKey:kRank];
  [request setValue:coreType forKey:kCoreType];
  [request setValue:attachAudioUrl forKey:kAttachAudioUrl];
  [request setValue:rank forKey:kRank];
  [request setValue:precision forKey:kPrecision];
  [request setValue:keywords forKey:kKeywords];
  [parameters setValue:request forKey:kRequest];
  
  return parameters;
}

- (NSDictionary *)createAudioParameters {
  NSMutableDictionary *audio = [[NSMutableDictionary alloc] init];
  [audio setObject:@"wav" forKey:kAudioType];
  [audio setObject:@16000 forKey:kSampleRate];
  [audio setObject:@2 forKey:kSampleBytes];
  [audio setObject:@1 forKey:kChannel];
  return [audio copy];
}

- (ChivoxAIInnerRecorder *)createInnerRecorder {
  ChivoxAIInnerRecorder *innerRecorder = [[ChivoxAIInnerRecorder alloc] init];
  innerRecorder.recordParam.channel = 1;
  innerRecorder.recordParam.sampleRate = 16000;
  innerRecorder.recordParam.sampleBytes = 2;
  
  // 获取本地播放文件路径
  NSString *device_id = [ChivoxAIEngine getDeviceId];
  NSString *filename = [[NSString alloc] initWithFormat:@"%@/Library/ChivoxRecord/%@.wav",NSHomeDirectory(),device_id];
  innerRecorder.recordParam.saveFile = filename;
  return innerRecorder;
}

RCT_EXPORT_METHOD(stopChivoxRecord:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
  if (self.cloudengine == nil) {
    [[AVAudioSession sharedInstance] setCategory:self.lastCategory error:nil];
    reject(@"0",@"stopChivoxRecord操作失败，cloudengine 为 nil", nil);
    return;
  }
  
  ChivoxAIRetValue * e  = nil;
  e = [self.cloudengine stop];
  if (0 != [e errId]){
    [[AVAudioSession sharedInstance] setCategory:self.lastCategory error:nil];
    NSString *errMsg = [NSString stringWithFormat:@"stopChivoxRecord操作失败:%@", e.error];
    reject(@([e errId]).stringValue, errMsg, nil);
  } else {
    resolve(nil);
  }
}

/**
 取消驰声评测
 */
RCT_EXPORT_METHOD(cancelChivoxRecord:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject) {
  if (self.cloudengine == nil) {
    [[AVAudioSession sharedInstance] setCategory:self.lastCategory error:nil];
    reject(@"0",@"stopChivoxRecord操作失败", nil);
    return;
  }
  
  [self.cloudengine cancel];
  resolve(nil);
}

@end
