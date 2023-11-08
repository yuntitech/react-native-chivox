//
//  ChivoxAIRecorderNotify.h
//  CAIEngine
//
//  Created by chivox on 2019/10/21.
//  Copyright © 2019 chivox. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface ChivoxAIRecorderNotify : NSObject
@property (nonatomic, strong, nullable) void (^onRecordStart)(void);
@property (nonatomic, strong, nullable) void (^onRecordStop)(void);
+ (ChivoxAIRecorderNotify *)sharedInstance;
@end
NS_ASSUME_NONNULL_END
