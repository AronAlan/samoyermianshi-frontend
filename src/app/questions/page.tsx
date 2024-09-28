"use server";
import Title from "antd/es/typography/Title";
import "./index.css";
import QuestionTable from "./compoents/QuestionTable";
import { listQuestionSimpleVoByPageUsingPost } from "@/api/questionController";

/**
 * 题目列表页面
 * @constructor
 */
export default async function QuestionsPage({ searchParams }: any) {
    const { q: searchText } = searchParams;
    let questionList = [];
    let total = 0;

    try {
        const questionRes = (await listQuestionSimpleVoByPageUsingPost({
            title: searchText,
            pageSize: 15,
            sortField: "createTime",
            sortOrder: "descend"
        })) as any;
        questionList = questionRes.data.records ?? [];
        total = questionRes.data.total ?? 0;
    } catch (e: any) {
        console.error("获取题目列表失败，" + e.message);
    }

    if (typeof window !== "undefined") {
        console.log(window["__NEXT_DATA__"]);
    }

    return (
        <div id="questionsPage" className="max-width-content">
            <Title level={3}>题目大全</Title>
            <QuestionTable
                defaultQuestionList={questionList}
                defaultTotal={total}
                defaultSearchParams={{
                    title: searchText
                }}
            />
        </div>
    );
}
