import { NativeModules, Platform } from "react-native";

const { ChivoxModule } = NativeModules;

/** 文件压缩参数 */
export interface ChivoxRecordParam {
  coreType: string;
  refText: string;
  attachAudioUrl: number;
}

/**
 * 监听数据返回的通知
 */
export const getChivoxDataNotification =
  "cn.bookln.oneClickLogin.getChivoxDataNotification";

class ImageCompressUtil {
  /**
   * 初始化
   * @param appKey
   * @param SecretKey
   */
  public initChivoxSdk(appKey: string, SecretKey: string) {
    ChivoxModule.initChivoxSdk(appKey, SecretKey);
  }

  /**
   * 开始录音，并监听数据的回调
   */
  public startChivoxRecord = async (
    param: ChivoxRecordParam
  ): Promise<string> => {
    return ChivoxModule.startChivoxRecord(param);
  };

  /**
   * 结束录音
   */
  public stopChivoxRecord = async (): Promise<string> => {
    return ChivoxModule.stopChivoxRecord();
  };
}

export const imageCompressUtil = new ImageCompressUtil();
