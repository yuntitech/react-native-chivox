import { NativeModules, Platform } from "react-native";

const { ChivoxModule } = NativeModules;

export interface ChivoxRecordParam {
  coreType: string;
  refText?: string;
  attachAudioUrl: number;
  keywords?: string[];
  rank?: number;
  precision?: number;
}
export interface RecordAndRetellRefParam {
  lm: LmParam[];
}

export interface LmParam {
  text: string;
}

/**
 * 监听数据返回的通知
 */
export const getChivoxDataNotification =
  "cn.bookln.oneClickLogin.getChivoxDataNotification";

class ChivoxRecordUtil {
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

export const chivoxRecordUtil = new ChivoxRecordUtil();
