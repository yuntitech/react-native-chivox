//
//  ChivoxAIRecordParam.h
//  CAIEngine
//
//  Created by chivox on 2019/10/30.
//  Copyright © 2019 chivox. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface ChivoxAIRecordParam : NSObject

/**
 * 录音时长, 毫秒. 如果值小于或等于0, 表示不限录音时长.
 * 缺省值: 0
 */
@property (nonatomic, assign) int duration;

/**
 * 通道数
 * 有效值: [1]
 * 缺省值: 1
 */
@property (nonatomic, assign) int channel;

/**
 * 采样字节数
 * 有效值: [1, 2]
 * 缺省值: 2
 */
@property (nonatomic, assign) int sampleBytes;

/**
 * 采样率
 * 有效值: [8000, 48000]
 * 缺省值: 16000
 */
@property (nonatomic, assign) int sampleRate;

/**
 * 录音机保存文件的路径
 */
@property (nonatomic, strong, nullable) NSString *saveFile;

@end
