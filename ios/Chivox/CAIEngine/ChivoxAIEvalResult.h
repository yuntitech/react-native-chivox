//
//  ChivoxAIEvalResult.h
//  CAIEngine
//
//  Created by chivox on 2019/10/21.
//  Copyright © 2019 chivox. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

typedef enum {
    kChivoxAIResultTypeUnknown = 0,
    kChivoxAIResultTypeError = 1,
    kChivoxAIResultTypeResult = 2,
    kChivoxAIResultTypeBin = 3,
    kChivoxAIResultTypeVad = 4,
    kChivoxAIResultTypeSoundIntensity = 5,
} ChivoxAIEvalResultType;

@interface ChivoxAIEvalResult : NSObject
@property (nonatomic, assign) BOOL isLast;
@property (nonatomic, assign) ChivoxAIEvalResultType type;
@property (nonatomic, strong, nullable) NSString *tokenId;
@property (nonatomic, strong, nullable) NSString *text;
@property (nonatomic, strong, nullable) NSData *data;
@property (nonatomic, strong, nullable) NSString *recFilePath;
@end

NS_ASSUME_NONNULL_END
