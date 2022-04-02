import { ChivoxRequest } from "./ChivoxTypes";

export type ChivoxEnPredScoreRequest = ChivoxRequest & {
   /**en.pred.score表示英文段落朗读 */
   coreType: string;
   /**
    * 指定英美式发音, 值有1、2、3，默认3；
   1: 英式发音
   2: 美式发音
   3: 不区分
   支持K12词汇，其它非K12词汇还在更新中。非K12词汇评测返回结果中accent值是0。
   */
   accent?: 1 | 2 | 3;
   /**
    * 总分评分分制，默认百分制。可以支持任意分制
    */
   rank: number;
   /** 评分精度，支持1和0.5，默认1 */
   precision?: 0.5 | 1;
   /**
    * 评测结果中是否返回音频url
       0: 不返回
       1: 返回
    */
   attachAudioUrl?: 0 | 1;
   /**
    * 评分参考文本，建议20~200个单词；
       详情参考文本符号说明
       https://www.chivox.com/opendoc/#/ChineseDoc/coreEn/textformat
   */
   refText: string;
   /**
    * 结果控制参数
    */
   result?: {
      /** 详细得分选项*/
      details?: {
         /**
          * 是否启用单词详细得分，默认0。
             0: 不启用
             1: 启用
          */
         word?: 0 | 1;
         /**
          * 总分松紧度调节开关,说明:
             传参范围为[-1,1]，精度0.1。
             传参为0和不传该参数一样，不对打分分数进行调整。
             传参为正数，提高打分分数，传参越大提高的分数越多。
             传参为负数，降低打分分数，传参越小降低的分数越多。
          */
         gop_adjust?: number;
         /**
          * 是否实时返回已读内容，默认0。支持多种模式
             0: 不返回
             1: 通用模式;
             2: 背诵模式, 返回的结果严格按照文本顺序从前往后;如果前面的句子有漏读，即使后面的句子正常朗读也不会返回；
             3: 自由模式, 返回用户实际朗读的参考文本中的内容，不考虑文本的前后顺序;
          */
         ext_cur_wrd?: 0 | 1 | 2 | 3
      }

   }


}
