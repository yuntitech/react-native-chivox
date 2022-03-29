import { ChivoxCoreType, ChivoxRequest } from "./ChivoxTypes";

/**
 * 英文单词纠音内核 request。
 *
 * @see https://www.chivox.com/opendoc/#/ChineseDoc/coreEn/en.word.pron
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


/* 
实际返回的结果和文档中的字段差别还挺大，暂时不写Type了

{
    "ccode":{
        "time":"1648564913834",
        "len":1374,
        "code":"897106c7809f435936dd8710367fd3fe6af8c3e6a2dd83d89cbd1fe341a40116"
    },
    "tokenId":"62431aae01760302cb000003",
    "result":{
        "wavetime":2786,
        "delaytime":43,
        "textmode":0,
        "systime":684,
        "res":"pron.wrd.G4.N1.0.2",
        "forceout":0,
        "overall":3,
        "info":{
            "snr":31.5625,
            "trunc":0,
            "clip":0,
            "volume":1281,
            "tipId":0
        },
        "rank":5,
        "timerate":0.245516,
        "details":{
            "word":[
                {
                    "dur":920,
                    "phone":[
                        {
                            "lab":"ae",
                            "is_err":0,
                            "rec":"ae",
                            "start":800,
                            "end":1040,
                            "dur":240
                        },
                        {
                            "lab":"k",
                            "is_err":0,
                            "rec":"k",
                            "start":1040,
                            "end":1160,
                            "dur":120
                        },
                        {
                            "lab":"s",
                            "is_err":0,
                            "rec":"s",
                            "start":1160,
                            "end":1280,
                            "dur":120
                        },
                        {
                            "lab":"ax",
                            "is_err":0,
                            "rec":"ax",
                            "start":1280,
                            "end":1360,
                            "dur":80
                        },
                        {
                            "lab":"n",
                            "is_err":0,
                            "rec":"n",
                            "start":1360,
                            "end":1440,
                            "dur":80
                        },
                        {
                            "lab":"t",
                            "is_err":0,
                            "rec":"t",
                            "start":1440,
                            "end":1720,
                            "dur":280
                        }
                    ],
                    "phn":[
                        {
                            "lab":"ae",
                            "is_err":0,
                            "rec":"ae",
                            "start":800,
                            "end":1040,
                            "dur":240
                        },
                        {
                            "lab":"k",
                            "is_err":0,
                            "rec":"k",
                            "start":1040,
                            "end":1160,
                            "dur":120
                        },
                        {
                            "lab":"s",
                            "is_err":0,
                            "rec":"s",
                            "start":1160,
                            "end":1280,
                            "dur":120
                        },
                        {
                            "lab":"ax",
                            "is_err":0,
                            "rec":"ax",
                            "start":1280,
                            "end":1360,
                            "dur":80
                        },
                        {
                            "lab":"n",
                            "is_err":0,
                            "rec":"n",
                            "start":1360,
                            "end":1440,
                            "dur":80
                        },
                        {
                            "lab":"t",
                            "is_err":0,
                            "rec":"t",
                            "start":1440,
                            "end":1720,
                            "dur":280
                        }
                    ],
                    "rec":"ae k s ax n t",
                    "end":1720,
                    "indict":1,
                    "stress":[
                        {
                            "ref":1,
                            "char":"ae_k",
                            "score":0
                        },
                        {
                            "ref":0,
                            "char":"s_ax_n_t",
                            "score":1
                        }
                    ],
                    "phoneme":{
                        "letters":"a_c_c_e_n_t",
                        "prons":"ae_k_s_ax_n_t"
                    },
                    "name":"accent",
                    "is_err":0,
                    "accent":3,
                    "start":800,
                    "lab":"ae k s ax n t"
                }
            ]
        },
        "version":"0.0.80.2021.12.13.10:28:01",
        "pretime":86
    },
    "uuid":"62431aaf04cfc270b6380439",
    "sdk":{
        "os":"iOS",
        "arch":"iPhone13,2",
        "version":"0x2021700",
        "source":"5",
        "os_version":"ios 15.0.2",
        "version_wrap":"2.0.7",
        "product":"iPhone13,2",
        "protocol":"1"
    },
    "time":{
        "request":"2022-03-29 22:41:51:52",
        "callback":"2022-03-29 22:41:53:834",
        "connect":"2022-03-29 22:41:50:954"
    },
    "eof":1,
    "recordId":"62431aaf04cfc270b6380439",
    "dtLastResponse":"2022-03-29 22:41:53:834",
    "params":{
        "app":{
            "timestamp":"1648564910731",
            "alg":"sha256",
            "applicationId":"1615874284000115",
            "userId":"",
            "sig":"47540d52e791409e515dcf9a3ac85ed04380fa4fbb1f24280e85e9dcd12a025b"
        },
        "request":{
            "refText":"accent",
            "coreType":"en.word.pron",
            "tokenId":"62431aae01760302cb000003"
        },
        "audio":{
            "sampleBytes":2,
            "channel":1,
            "sampleRate":16000,
            "audioType":"ogg"
        }
    },
    "applicationId":"1615874284000115"
}

*/

// /**
//  * 英文单词纠音内核 response。
//  *
//  * @see https://www.chivox.com/opendoc/#/ChineseDoc/coreEn/en.word.pron
//  */
// export type ChivoxEnWordPronResponse = ChivoxResponse & {
//   result: {
//     /** 总分 */
//     overall: number;

//     /** 音频时长(单位:毫秒) */
//     wavetime: number;

//     /** 音素详细得分 */
//     details: {
//       /** 单词级详细得分 */
//       word: {
//         /**
//          * 英美音区分标记。
//          * - 0: 未做标记的发音
//          * - 1: 英式发音
//          * - 2: 美式发音
//          * - 3: 英式发音和美式发音相同
//          */
//         accent: 0 | 1 | 2 | 3;

//         /** 评测文本 */
//         name: string;

//         /**
//          * 该单词是否包含在评测字典里。
//          * - 1，该单词包含在评测字典里。
//          * - 0，该单词不包含在评测字典里，属于集外词。
//          *
//          * 可能层级有错？
//          */
//         indict: number;

//         /**
//          * 该单词的标准发音音素序列，详情请参考音标对照表
//          *
//          * @see https://www.chivox.com/opendoc/#/ChineseDoc/coreEn/PhoneTable
//          */
//         lab: string;

//         /**
//          * 识别出的发音音素，详情请参考音标对照表
//          *
//          * @see https://www.chivox.com/opendoc/#/ChineseDoc/coreEn/PhoneTable
//          */
//         rec: string;

//         /** 该单词的发音是否正确，0正确，1错误 */
//         is_err: 0 | 1;

//         /** 单词在音频中的起始时间(单位:毫秒) */
//         start: number;

//         /** 单词在音频中的结束时间(单位:毫秒) */
//         end: number;

//         /** 音素级详细得分 */
//         phone: {
//           /**
//            * 单词的标准音素，如果没有，用＃表示。
//            * 详情请参考音标对照表
//            *
//            * @see https://www.chivox.com/opendoc/#/ChineseDoc/coreEn/PhoneTable
//            */
//           lab: string;

//           /**
//            * 音素错误类型
//            * - 0：发音结果正确
//            * - 1：插入(多读)错误
//            * - 2：删除(漏读)错误
//            * - 3：替换(错读)错误
//            * - 4：标准要求浊化，用户发音没有浊化。
//            */
//           is_err: 0 | 1 | 2 | 3 | 4;

//           /**
//            * 识别出的发音音素，如果没有，用＃表示。
//            * 详情请参考音标对照表
//            *
//            * @see https://www.chivox.com/opendoc/#/ChineseDoc/coreEn/PhoneTable
//            */
//           rec: string;

//           /** 音素在音频中的起始时间(单位:毫秒) */
//           start: number;

//           /** 音素在音频中的结束时间(单位:毫秒) */
//           end: number;
//         };

//         /** 音节是否重读 */
//         stress: {
//           /** 音节 */
//           char: string;

//           /**
//            * 评测字典中对该音节重读标记状态，值有0,1。
//            * 状态说明：
//            * - 0：没有标记重读
//            * - 1：标记重读
//            */
//           ref: 0 | 1;

//           /**
//            * 检测发音是否重读，取值有0,1。
//            * 状态说明：
//            * - 0：用户没有重读
//            * - 1：用户重读了该音节
//            */
//           score: 0 | 1;
//         };

//         /**
//          * 字母音素（音标）对应关系。
//          *
//          * 根据音素（音标）的分数给相应的字母渲染颜色。
//          * 如下单词不支持改功能，返回结果中该字段为{} 。
//          * 不支持的单词如下：
//          * - （1）不支持含数字(0-9)的单词。
//          * - （2）不支持带连词符(-)的单词 。
//          * - （3）不支持带点（.）的缩略词。
//          * - （4）不支持带撇（'）的词。
//          * - （5）不支自定义发音的词。
//          */
//         phoneme: object;

//         /** 标准字母序列 */
//         letters: string;

//         /** 标准发音音素序列，例如：prons: p_aa_s_t */
//         prons: number;
//       };
//     };
//     info: {
//       /**
//        * 音频质量
//        *
//        * 详情请参考tipId字段说明，https://www.chivox.com/opendoc/#/ChineseDoc/coreEn/tipId
//        */
//       tipId: number;

//       /**
//        * 错误信息提示
//        * - 1. "post proc failed": 可能是音频没有录制成功或者引擎没有检测到用户的有效语音，可以提示用户重新录音;
//        * - 2. "fa decode failed!": 音频质量较差导致解析失败，可以提示用户重新录制；
//        */
//       tips: string;
//     };
//   };
// };
