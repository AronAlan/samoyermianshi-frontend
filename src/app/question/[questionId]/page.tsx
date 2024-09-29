"use server";
import { Flex, Menu, message } from "antd";
import { getQuestionBankVoByIdUsingGet } from "@/api/questionBankController";
import Title from "antd/es/typography/Title";
import { getQuestionVoByIdUsingGet } from "@/api/questionController";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import Link from "next/link";
import "./index.css";
import QuestionCard from "@/compoents/QuestionCard";

/**
 * 题库题目详情页
 * @constructor
 */
export default async function QuestionPage({ params }: any) {
    const { questionBankId, questionId } = params;

    // 获取题目详情
    let question = undefined;
    try {
        const res = await getQuestionVoByIdUsingGet({
            id: questionId
        });
        question = res.data as any;
    } catch (e: any) {
        console.error("获取题目详情失败，" + e.message);
    }
    // 错误处理
    if (!question) {
        return <div>获取题目详情失败，请刷新重试</div>;
    }

    return (
        <div id="uestionPage" className="max-width-content">
            <Content>
                <QuestionCard question={question} />
            </Content>
        </div>
    );
}
