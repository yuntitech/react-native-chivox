/**
 * - 英文单词	en.word.score	<20
 * - 英文单词纠音	en.word.pron	<20
 * - 英文句子	en.sent.score	<40
 * - 英文句子纠音	en.sent.pron	<40
 * - 英文段落	en.pred.score	<180
 * - 英文口语选择内核	en.choc.score	<60
 * - 英文AI Talk	en.sent.recscore	<40
 * - 英文半开放题型	en.scne.exam	<120
 * - 英文开放题型	en.prtl.exam	<180
 * - 英文自由识别评测	en.asr.rec	≤300
 *
 * @deprecated 直接传字符串即可，不再固定类型
 */
 export enum ChivoxCoreType {
  EnWordScore = "en.word.score",
  EnWordPron = "en.word.pron",
  EnSentScore = "en.sent.score",
  EnSentPron = "en.sent.pron",
  EnPredScore = "en.pred.score",
  EnChocScore = "en.choc.score",
  EnSentRecScore = "en.sent.recscore",
  EnScneExam = "en.scne.exam",
  EnPrtlExam = "en.prtl.exam",
  EnAsrRec = "en.asr.rec",
}

/**
 * 基础Request，不直接使用。
 * 使用具体的request类型，如ChivoxEnWordPronRequest。
 *
 * @deprecated 直接传对象即可，不再固定结构
 */
export type ChivoxRequest = {
  coreType: ChivoxCoreType;

  /**
   * 指定英美式发音, 值有1、2、3，默认3；
   * - 1: 英式发音
   * - 2: 美式发音
   * - 3: 不区分
   *
   * 支持K12词汇，其它非K12词汇还在更新中。非K12词汇评测返回结果中accent值是0。
   */
  accent?: 1 | 2 | 3;

  /**
   * 评测结果中是否返回音频url
   * - 0: 不返回
   * - 1: 返回
   */
  attachAudioUrl?: 0 | 1;
};

/**
 * @deprecated 直接使用返回的JSON object即可，不再固定结构
 */
export type ChivoxResponse = {
  /**
   * 音频及数据对应的唯一标识，请保存到产品数据库，方便排查问题
   */
  uuid: string;

  /**
   * 音频下载地址
   * - http访问：在该字段末尾加上".mp3"即可
   * - https访问：将端口号移除，末尾加上“.mp3”，前缀增加"https://"即可
   *
   * 示例:https://download.cloud.chivox.com/XXXXXXXX.mp3
   *
   *
   * 提示
   * - 音频保留一周,如需长久保存,建议下载至自己的服务器。
   * - 域名会因不同访问区域而不同，以实际返回为准。
   */
  audioUrl: string;

  /** 测评结果 */
  result: object;
};
