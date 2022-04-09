import { ChivoxCoreType, ChivoxRequest } from "./ChivoxTypes";

/**
 * 英文单词纠音内核 request。
 *
 * @see https://www.chivox.com/opendoc/#/ChineseDoc/coreEn/en.word.pron
 * 
 * @deprecated 直接传对象即可，不再固定结构
 */
export type ChivoxEnWordPronRequest = ChivoxRequest & {
  /** en.word.pron表示英文单词检错纠错评测 */
  coreType: ChivoxCoreType.EnWordPron;

  /**
   * 评分参考文本，仅支持单词，不带任何标点, 如"past"。
   *
   * 详情参考文本符号说明 https://www.chivox.com/opendoc/#/ChineseDoc/coreEn/textformat
   */
  refText: string;

  /**
   * 评分分制，默认5分制。
   * 支持4分制、5分制或百分制，可填4、5或100。
   */
  rank?: number;

  /**
   * 浊化开关，可填0或1，默认是1。
   * - 值为0，表示用户发音浊化和非浊化都算正确。
   * - 值为1，表示用户发音必须浊化才算正确。
   */
  voiced?: 0 | 1;

  /** 结果控制参数设置 */
  result?: {
    details?: {
      /**
       * 总分松紧度调节开关,说明:
       * - 传参范围为[-1,1]，精度0.1。
       * - 传参为0和不传该参数一样，不对打分分数进行调整。
       * - 传参为正数，提高打分分数，传参越大提高的分数越多。
       * - 传参为负数，降低打分分数，传参越小降低的分数越多。
       */
      gop_adjust?: number;
    };
  };
};
