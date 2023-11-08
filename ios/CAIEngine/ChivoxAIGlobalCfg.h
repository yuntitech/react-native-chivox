//
//  ChivoxAIGlobalCfg.h
//  CAIEngine
//
//  Created by sq-ios92 on 2020/12/3.
//  Copyright © 2020年 chivox. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface ChivoxAIGlobalCfg : NSObject

+ (NSString *)getUserId;

+ (void)setUserId:(NSString *)userId;

+ (BOOL)isLogUpEnable;

+ (void)setLogUpEnable:(BOOL)enable;

@end
