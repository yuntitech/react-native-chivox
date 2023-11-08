//
//  ChivoxAIEngine.h
//  CAIEngine
//
//  Created by chivox on 2019/10/21.
//  Copyright © 2019 chivox. All rights reserved.
//

#import <Foundation/Foundation.h>

@class ChivoxAIEngine;
@class ChivoxAIRetValue;
@class ChivoxAIEval;
@class ChivoxAISdkInfo;
@class ChivoxAIEvalResult;
@class ChivoxAIRetValue;
@class ChivoxAIEvalParam;
@class ChivoxAIEvalResultListener;
@class ChivoxAIAudioSrc;


NS_ASSUME_NONNULL_BEGIN

/**
 * 引擎创建成功回调
 * @param engine 已创建的引擎对象
 */
typedef void (^ChivoxAIEngineCreateSuccess)(ChivoxAIEngine *engine);
/**
 * 引擎创建失败回调
 * @param err 失败信息
 */
typedef void (^ChivoxAIEngineCreateFail)(ChivoxAIRetValue *err);

/**
 * 引擎创建回调类
 */
@interface ChivoxAIEngineCreateCallback : NSObject
/**
 * 创建回调对象
 * @param success 成功回调
 * @param fail 失败回调
 */
+ (instancetype)onSuccess:(ChivoxAIEngineCreateSuccess)success onFail:(ChivoxAIEngineCreateFail)fail;
- (instancetype)init NS_UNAVAILABLE; // 禁止外部调用init
@end


/**
 * 评测引擎类
 */
@interface ChivoxAIEngine : NSObject
/**
 * 二次封装日志
 */
@property (nonatomic, strong, nullable) NSString *logFile;
/**
 * 创建引擎（异步的）
 * @param cfg 引擎配置
 * @param cb 回调
 */
+ (void)create:(NSMutableDictionary *)cfg cb:(ChivoxAIEngineCreateCallback *)cb;
- (instancetype)init NS_UNAVAILABLE; // 禁止外部调用init

- (void)setWifiStatus:(NSString *)status;

/**
 * 评测开始
 * @param param 评测参数
 * @return 错误信息
 */
- (ChivoxAIRetValue *)start:(ChivoxAIAudioSrc *)audioSrc tokenId:(NSMutableString *)tokenId param:(NSMutableDictionary *)param listener:(ChivoxAIEvalResultListener *)listener;

/**
 * 输入音频数据(内部录音模式无需调用本方法)
 * @param bytes 数据缓冲区
 * @param length 长度
 * @return 错误信息
 */
- (ChivoxAIRetValue *)feed:(const void *)bytes length:(int)length;

/**
 * 评测结束
 * @return 错误信息
 */
- (ChivoxAIRetValue *)stop;

/**
 * 取消评测
 */
- (void)cancel;

/**
 * 销毁引擎
 */
- (void)destory;

/**
 * 获取设备ID
 */
+ (nullable NSString *)getDeviceId;
/**
 * 设备激活, 方法内部会把序列号保存在[NSUserDefaults standardUserDefaults]中, 下次调用直接返回已保存的值
 * @param input JSON { "appKey": "", "secretKey": ""}
 * @return JSON {"error": "", "serialNumber": ""}
 */
+ (nullable NSDictionary *)getSerialNumber:(NSDictionary *)input;
/**
 * 删除已保存的序列号
 * @param appKey 驰声AppKey
 */
+ (BOOL)clearSavedSerialNumber:(NSString *)appKey;
/**
 * 二次授权(某些AppKey支持二次授权)
 * @param input JSON {"appKey": "", "secretKey": ""}
 * @return JSON {"error": "", "serialNumber": "", "provision": ""}  provision字段为base64格式的证书文件
 */
+ (nullable NSDictionary *)getProvision:(NSDictionary *)input;
/**
 * 获取sdk信息
 */
+ (ChivoxAISdkInfo *)sdkInfo;
@end

/**
 * 评测结果监听类
 */
@interface ChivoxAIEvalResultListener : NSObject
@property (nonatomic, strong) void (^onEvalResult)(NSString *tokenId, ChivoxAIEvalResult *result);
@property (nonatomic, strong) void (^onBinResult)(NSString *tokenId, ChivoxAIEvalResult *result);
@property (nonatomic, strong) void (^onError)(NSString *tokenId, ChivoxAIEvalResult *result);
@property (nonatomic, strong) void (^onVad)(NSString *tokenId, ChivoxAIEvalResult *result);
@property (nonatomic, strong) void (^onSoundIntensity)(NSString *tokenId, ChivoxAIEvalResult *result);
@property (nonatomic, strong) void (^onOther)(NSString *tokenId, ChivoxAIEvalResult *result);
@end

NS_ASSUME_NONNULL_END
