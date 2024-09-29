"use server";

import Title from "antd/es/typography/Title";
import { getQuestionBankVoByIdUsingGet } from "@/api/questionBankController";
import { Avatar, Button, Card } from "antd";
import Meta from "antd/es/card/Meta";
import Paragraph from "antd/es/typography/Paragraph";
import "./index.css";
import QuestionList from "@/compoents/QuestionList";

/**
 * 题库详情页面
 * @constructor
 */
export default async function BankPage({ params }: any) {
    const { questionBankId } = params;

    let bank = undefined;

    try {
        const bankRes = await getQuestionBankVoByIdUsingGet({
            id: questionBankId,
            needQueryQuestionList: true,
            pageSize: 200
        });
        bank = bankRes.data as any;
    } catch (e: any) {
        console.error("获取题库详情失败，" + e.message);
    }

    if (!bank) {
        return <div>获取题库详情失败，请刷新重试</div>;
    }

    // 获取第一道题目，用于 “开始刷题” 按钮跳转. 默认跳转到第一道题目，没有题目则禁用
    let firstQuestionId;
    if (bank.questionPage?.records && bank.questionPage.records.length > 0) {
        firstQuestionId = bank.questionPage.records[0].id;
    }

    return (
        <div id="bankPage" className="max-width-content">
            <Card>
                <Meta
                    avatar={<Avatar src={bank.picture} size={72} />}
                    title={
                        <Title level={3} style={{ marginBottom: 0 }}>
                            {bank.title}
                        </Title>
                    }
                    description={
                        <>
                            <Paragraph type="secondary">
                                {bank.description}
                            </Paragraph>
                            <Button
                                type="primary"
                                shape="round"
                                disabled={!firstQuestionId}
                                href={`/bank/${questionBankId}/question/${firstQuestionId}`}
                                target="_blank"
                            >
                                开始刷题
                            </Button>
                        </>
                    }
                />
            </Card>
            <div style={{ marginBottom: 16 }} />
            <QuestionList
                questionList={bank.questionPage?.records || []}
                cardTitle={`题目列表（${bank.questionPage?.total || 0}）`}
                questionBankId={questionBankId}
            />
        </div>
    );
}
