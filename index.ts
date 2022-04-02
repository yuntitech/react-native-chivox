import { NativeEventEmitter, NativeModules } from "react-native";
import {
  ChivoxCoreType, ChivoxRequest,
  ChivoxResponse
} from "./src/types/ChivoxTypes";
import { ChivoxEnPredScoreRequest } from "./src/types/EnPredScoreTypes";
import { ChivoxEnPrtlExamRequest } from "./src/types/EnPrtlExamTypes";
import { ChivoxEnScneExamRequest } from "./src/types/EnScneExamTypes";
import { ChivoxEnSentPronRequest } from "./src/types/EnSentPronTypes";
import { ChivoxEnSentScoreRequest } from "./src/types/EnSentScoreTypes";
import {
  ChivoxEnWordPronRequest
} from "./src/types/EnWordPronTypes";

export {
  ChivoxRequest,
  ChivoxResponse,
  ChivoxCoreType,
  ChivoxEnWordPronRequest,
  ChivoxEnSentScoreRequest,
  ChivoxEnSentPronRequest,
  ChivoxEnScneExamRequest,
  ChivoxEnPrtlExamRequest,
  ChivoxEnPredScoreRequest
};

const { ChivoxModule } = NativeModules;

export interface ChivoxRecordResultParam {
  word?: number;
}

/**
 * @see https://www.chivox.com/opendoc/#/ChineseDoc/sdkDoc/iOS-sdk?id=_25评测请求参数说明
 */
export interface ChivoxRecordParam {
  /** 设置“cloud”，表示使用在线评测功能 */
  coreProvideType?: "cloud";

  /**
   * 是否实时返回音量，默认0，如果设置1，音量大小通过 5.接收结果中onSoundIntensity接口回调，参数为“sound_intensity”,数值范围0~100；
   */
  soundIntensityEnable?: number;

  /** 声音检测功能 */
  vad?: {
    /**
     * 默认0。
     * 1 表示本次评测启用 VAD 功能。
     * 0 表示本次评测不启用vad功能。
     */
    vadEnable?: number;

    /**
     * 设置音频 vad 延迟生效时长(单位:秒)，
     * 在刚开始录音的几秒内屏蔽 VAD
     */
    refDuration?: number;

    /**
     * 灵敏度，单位 20ms，设置 N(默认15), 表示说话停止后 20*N 毫秒
     * 判定为结束
     */
    speechLowSeek?: number;
  };

  /** app相关信息 */
  app?: {
    /**
     * 终端用户标识。
     * 建议根据用户账号填写userId，方便排查问题。
     */
    userId?: string;
  };
  /**
   * 音频参数。
   * 默认：
   * - audioType: 'wav'
   * - channel: 1
   * - sampleBytes: 2
   * - sampleRate: 16000
   */
  audio?: {
    /** 音频编码格式 */
    audioType: string;

    /** 音频通道数 */
    channel: number;

    /** 音频采样位数 */
    sampleBytes: number;

    /** 音频采样率 */
    sampleRate: number;
  };

  /**
   * 评测请求，不同内核请求参数有所不同，具体查看英文内核 , 中文内核
   * - https://www.chivox.com/opendoc/#/ChineseDoc/coreEn/
   * - https://www.chivox.com/opendoc/#/ChineseDoc/coreCn/
   */
  request?: ChivoxRequest;
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
  public addListener(
    type: ChivoxRecordEventType,
    callback: (data: ChivoxRecordEventCallBack) => void
  ) {
    const emitter = this._emitter;
    if (emitter == null) {
      throw new Error(
        "Cannot use ChivoxRecordUtil when `isAvailable` is false."
      );
    }
    if (!Object.values(ChivoxRecordEventType).includes(type)) {
      throw new Error("请传入正确的 type");
    }
    switch (type) {
      case ChivoxRecordEventType.InnerRecordEvent: {
        const handler: (data: ChivoxRecordEventCallBack) => void = callback;
        return emitter.addListener(
          getChivoxDataNotification,
          (data: ChivoxRecordEventCallBack) => {
            handler(data);
          }
        );
      }
      // TODO: 外部录音原生端目前待实现
      case ChivoxRecordEventType.OuterReedEvent: {
        const handler: (data: ChivoxRecordEventCallBack) => void = callback;
        return emitter.addListener(
          getChivoxDataNotification,
          (data: ChivoxRecordEventCallBack) => {
            handler(data);
          }
        );
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
    const audioParam: ChivoxRecordParam["audio"] = param.audio ?? {
      audioType: "wav",
      sampleRate: 16000,
      sampleBytes: 2,
      channel: 1,
    };

    const paramWithDefault: ChivoxRecordParam = {
      ...param,
      coreProvideType: param.coreProvideType ?? "cloud",
      audio: audioParam,
    };
    return ChivoxModule.startChivoxRecord(paramWithDefault);
  };

  /**
   * 结束录音
   */
  public stopChivoxRecord = async (): Promise<string> => {
    return ChivoxModule.stopChivoxRecord();
  };
}

export const chivoxRecordUtil = new ChivoxRecordUtil();
