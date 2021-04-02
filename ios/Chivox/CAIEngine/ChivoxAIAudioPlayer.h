//
//  ChivoxAIAudioPlayer.h
//  CAIEngine
//
//  Created by chivox on 2019/10/21.
//  Copyright © 2019 chivox. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <AVFoundation/AVFoundation.h>

@class ChivoxAIAudioPlayer;

@interface ChivoxAIAudioPlayerListener : NSObject
@property (nonatomic, strong) void (^onStarted)(ChivoxAIAudioPlayer *ap);
@property (nonatomic, strong) void (^onStopped)(ChivoxAIAudioPlayer *ap);
@property (nonatomic, strong) void (^onError)(ChivoxAIAudioPlayer *ap, NSString *err);
@end

@interface ChivoxAIAudioPlayer : NSObject<AVAudioPlayerDelegate>

+ (ChivoxAIAudioPlayer *)sharedInstance;
- (void)setListener:(ChivoxAIAudioPlayerListener *)_event;
- (void)playFile:(NSString *)path;
- (void)cancel;

@end
