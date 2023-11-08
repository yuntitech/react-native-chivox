//
//  ChivoxAIResTool.h
//  CAIEngine
//
//  Created by chivox on 2019/10/21.
//  Copyright © 2019 chivox. All rights reserved.
//

#import <Foundation/Foundation.h>


@interface ChivoxAIResTool : NSObject
/**
 * @param progress 进度反馈
 */
@property (nonatomic, strong) void (^onProgress)(float i);

/**
 * 解压评测资源. 本方法会阻塞,所以请在后台线程调用本方法.
 * @param assetMng 资源源路径
 * @param assetNames 资源文件名列表, 例如: {"en.word.score.zip", "en.sent.score.zip", "cn.word.score.zip", ...}, 按需填写.
 *                   资源文件名应包含".zip"后缀, 解压后将在目标目录下产生一个文件夹, 该文件夹的名称为资源文件名去掉".zip"后缀.
 * @param resRoot 目标目录.
 *                如果目标目录中已存在相同资源(md5sum相同), 则不会重复执行解压操作, 如果目标目录下的资源md5sum不相同, 则会覆盖目标目录下的资源.
 * @return 是否解压成功. 返回null表示成功, 否则表示失败以及失败原因.
 */
- (NSString *)extract:(NSString *)assetMng assets:(NSMutableArray *)assetNames target:(NSString *)resRoot;

- (NSString *)getVadResPath:(NSString *)resRoot :(NSString *)resName;
- (NSMutableDictionary *)loadNativeCfg:(NSString *)resRoot :(NSMutableArray *)resNames;
@end
