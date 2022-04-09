import { ChivoxCoreType, ChivoxRequest } from "./ChivoxTypes";

/**
 * 英文句子检错纠错 request。
 *
 * @see https://www.chivox.com/opendoc/#/ChineseDoc/coreEn/en.sent.pron
 *
 * @deprecated 直接传对象即可，不再固定结构
 */
export type ChivoxEnSentPronRequest = ChivoxRequest & {
  /** en.sent.pron表示英文句子检错纠错评测 */
  coreType: ChivoxCoreType.EnSentPron;
  /**
   * 指定英美式发音, 值有1、2、3，默认3；
      1: 英式发音
      2: 美式发音
      3: 不区分
      支持K12词汇，其它非K12词汇还在更新中。非K12词汇评测返回结果中accent值是0。
   */
  accent?: 1 | 2 | 3;
  /**
   * 评分参考文本，建议单词数量2-20个，标点符号详情参考文本符号说明
   * @see https://www.chivox.com/opendoc/#/ChineseDoc/coreEn/textformat
   */
  refText: string;
  /** 评分分制，填写100 */
  rank: number;
  /** 
   * 浊化开关，可填0或1，默认是1。
      值为0，表示用户发音浊化和非浊化都算正确。
      值为1，表示用户发音必须浊化才算正确。
   */
  voiced?: 0 | 1;
  /**
   * 评测结果中是否返回音频url
     0: 不返回
     1: 返回
   */
  attachAudioUrl?: 0 | 1;
  /** 结果控制参数 */
  result?: {
    /**详细得分选项 */
    details?: {
      /**
       * 是否实时返回已读内容，默认0
         0: 不返回
         1: 返回
       */
      ext_cur_wrd?: 0 | 1;
      /**
       * 打分松紧度调节开关,说明:
          传参范围为[-1,1]，精度0.1。
          传参为0和不传该参数一样，不对打分分数进行调整。
          传参为正数，提高打分分数，传参越大提高的分数越多。
          传参为负数，降低打分分数，传参越小降低的分数越多。
       */
      gop_adjust?: number;
    };
  };
};
