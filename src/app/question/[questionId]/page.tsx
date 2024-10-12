"use server";
import { message } from "antd";
import { getQuestionVoByIdUsingGet } from "@/api/questionController";
import "./index.css";
import QuestionCard from "@/compoents/QuestionCard";

/**
 * 题目详情页
 * @constructor
 */
export default async function QuestionPage({ params }: any) {
    const { questionId } = params;

    // 获取题目详情
    let question = undefined;
    try {
        const res = (await getQuestionVoByIdUsingGet({
            id: questionId
        })) as any;
        question = res.data;
    } catch (e: any) {
        message.error("获取题目详情失败，" + e.message);
    }
    // 错误处理
    if (!question) {
        return <div>获取题目详情失败，请刷新重试</div>;
    }

    return (
        <div id="questionPage">
            <QuestionCard question={question} />
        </div>
    );
}
