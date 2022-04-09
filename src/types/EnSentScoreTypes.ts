import { ChivoxCoreType, ChivoxRequest } from "./ChivoxTypes";

/**
 * 英文句子内核 request。
 *
 * @see https://www.chivox.com/opendoc/#/ChineseDoc/coreEn/en.sent.score
 * 
 * @deprecated 直接传对象即可，不再固定结构
 */
export type ChivoxEnSentScoreRequest = ChivoxRequest & {
  /** en.sent.score表示英文句子融合评测内核，自适应少儿、成人群体 */
  coreType: ChivoxCoreType.EnSentScore;

  /**
   * 评分参考文本，支持整个句子，可以带标点符号，
   * 单词个数建议在2~20个单词之间，如"I want to know the past and present of Hong Kong."
   * 详情参考文本符号说明。
   * 超过20个单词，建议使用段落朗读评测。
   */
  refText: string;

  /**
   * 评分分制，默认百分制。
   * 支持4分制或百分制，可填4或100。
   */
  rank?: number;

  /**
   * 浊化开关，可填0或1，默认是1。
   * - 值为0，表示用户发音浊化和非浊化都算正确。
   * - 值为1，表示用户发音必须浊化才算正确。
   */
  voiced?: 0 | 1;

  /** 结果控制参数 */
  result?: {
    /** 详细得分选项 */
    details?: {
      /**
       * 评测结果中是否返回音素维度，默认为0
       * - 0: 不返回
       * - 1: 返回
       */
      phone?: 0 | 1;

      /**
       * 是否开启连读失爆检测，默认为0。
       * - 0: 不开启
       * - 1: 开启
       */
      connti?: 0 | 1;

      /**
       * 打分松紧度调节开关,说明:
       * 传参范围为[-1,1]，精度0.1。
       * - 传参为0和不传该参数一样，不对打分分数进行调整。
       * - 传参为正数，提高打分分数，传参越大提高的分数越多。
       * - 传参为负数，降低打分分数，传参越小降低的分数越多。
       */
      gop_adjust?: number;
    };
  };
};

