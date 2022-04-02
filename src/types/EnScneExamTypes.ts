import { ChivoxCoreType, ChivoxRequest } from "./ChivoxTypes";

export type ChivoxEnScneExamRequest = ChivoxRequest & {
    /**en.scne.exam表示半开放题型 */
    coreType: ChivoxCoreType.EnScneExam;
    /**
     * 总分评分分制, 支持任意分制。
     */
    rank: number;
    /** 评分精度，支持1和0.5 */
    precision: 1 | 0.5;
    /**评测结果中是否返回音频url */
    attachAudioUrl?: 0 | 1;
    /**
     * 关键的 词、词组、短语
     注意点
     1.尽可能将重要的得分要点提取为关键词，建议每句话至少设置一个关键词；
     2.支持并列关键词，同一层级输入多个近义词表示同一个要点，详见下面的参数样例；
     3.请确保关键词的正确性，用户发音没有包含关键词，会直接影响内容维度打分进而影响总分；
     4.关键词需要出现在下面的refText字段的参考答案内容里；
     */
    keyWords?: string[],
    /**	参考答案 */
    refText: {
        lm: {
            /**
             * 参考答案，可以有多种可能的答案和说法。每种答案建议不要超过两句话。建议填写10个以上的答案。
                文本格式参考文本符号说明
    
                注意点：
                1.答案需要填入正确的内容，不能文不对题或存在语法错误等;
                2.答案尽量涵盖学生的各种可能表达方式。在建议的数量上，可以多传入;
                3.答案应该站在最终用户的表达角度上写;
                https://www.chivox.com/opendoc/#/ChineseDoc/coreEn/textformat
             */
            text: string
        }
        /** 结果控制参数 */
        result: {
            details: {
                /**
                 * 统一各维度评分分制，设置为1
                 */
                use_inherit_rank: number
            }
        }
    }
}