import { NativeEventEmitter, NativeModules } from "react-native";

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
  "com.yunti.chivox.getChivoxDataNotification";

export type ChivoxRecordEventCallBack = {
  success: boolean;
  data: string;
};

export enum ChivoxRecordEventType {
  /**
   * 内置录音
   */
  InnerRecordEvent = "innerRecordEvent",
  /**
   * 外部录音
   */
  OuterReedEvent = "outerRecordEvent",
}

class ChivoxRecordUtil {
  private isAvailable: boolean;
  private _emitter?: NativeEventEmitter;
  constructor() {
    if (ChivoxModule == null) {
      this.isAvailable = false;
    } else {
      this.isAvailable = true;
      const emitter = new NativeEventEmitter(ChivoxModule);
      this._emitter = emitter;
    }
  }


  /**
   * 添加监听
   */
  public addListener(type: ChivoxRecordEventType, callback: (data: ChivoxRecordEventCallBack) => void) {
    const emitter = this._emitter;
    if (emitter == null) {
      throw new Error('Cannot use ChivoxRecordUtil when `isAvailable` is false.');
    }
    if (!Object.values(ChivoxRecordEventType).includes(type)) {
      throw new Error('请传入正确的 type');
    }
    switch (type) {
      case ChivoxRecordEventType.InnerRecordEvent: {
        const handler: (data: ChivoxRecordEventCallBack) => void = callback;
        return emitter.addListener(getChivoxDataNotification, (data: ChivoxRecordEventCallBack) => {
          handler(data);
        });
      }
      // TODO: 外部录音原生端目前待实现
      case ChivoxRecordEventType.OuterReedEvent: {
        const handler: (data: ChivoxRecordEventCallBack) => void = callback;
        return emitter.addListener(getChivoxDataNotification, (data: ChivoxRecordEventCallBack) => {
          handler(data);
        });
      }
    }
  }

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

  /**
   * 创建外部录音
   * 
   * 音频参数
   * @param param 
   * @returns 
   */
  public outerFeed = async (param: ChivoxRecordParam): Promise<string> => {
    return ChivoxModule.outerFeed(param);
  }

  /**
   * 发送录音
   * 
   * 录音本地地址
   * @param path 
   */
  public sendOuterFeedAudioFile = async (path: string): Promise<string> => {
    return ChivoxModule.sendOuterFeedAudioFile(path);
  }
}

export const chivoxRecordUtil = new ChivoxRecordUtil();
