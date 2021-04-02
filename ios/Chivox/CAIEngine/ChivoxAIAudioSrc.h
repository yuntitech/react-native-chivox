//
//  ChivoxAIAudioSrc.h
//  CAIEngine
//
//  Created by sq-ios92 on 2020/3/26.
//  Copyright © 2020年 chivox. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ChivoxAIRecordParam.h"
@class ChivoxAIRecordParam;

@interface ChivoxAIAudioSrc : NSObject
@end

@interface ChivoxAIOuterFeed : ChivoxAIAudioSrc

@end

@interface ChivoxAIInnerRecorder : ChivoxAIAudioSrc
/**
 *录音参数可以设置，具体请参考ChivoxAIRecordParam类。
 */
@property (nonnull,nonatomic,strong)ChivoxAIRecordParam *recordParam;

@end
