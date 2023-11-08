//
//  ChivoxAIRetValue.h
//  CAIEngine
//
//  Created by chivox on 2019/11/13.
//  Copyright © 2019 chivox. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * 返回信息包装类
 */
@interface ChivoxAIRetValue : NSObject
/**
 * 错误码
 */
- (int)errId;
/**
 * 错误信息
 */
- (NSString *)error;
@end

NS_ASSUME_NONNULL_END


