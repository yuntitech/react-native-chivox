//
//  ChivoxAISdkInfo.h
//  CAIEngine
//
//  Created by chivox on 2019/10/21.
//  Copyright © 2019 chivox. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface ChivoxAISdkInfo : NSObject
- (instancetype)init NS_UNAVAILABLE;// 禁止外部调用init
- (int)versionMajor;
- (int)versionMinor;
- (int)versionPatch;
- (int)versionTweak;
- (NSString *)versionBuild;
- (NSString *)version;
- (NSString *)commonSdkVersion;
- (NSString *)commonSdkModules;
@end

NS_ASSUME_NONNULL_END
