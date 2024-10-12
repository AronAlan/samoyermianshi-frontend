"use client";

import { Card } from "antd";
import Title from "antd/es/typography/Title";
import "./index.css";
import TagList from "../TagList";
import MdViewer from "../MdViewer";

interface Props {
    question: API.QuestionVO;
}

const QuestionCard = (props: Props) => {
    const { question } = props;

    return (
        <div className="question-card">
            <Card bordered={false}>
                <Title level={1} style={{ fontSize: 24 }}>
                    {question.title}
                </Title>
                <TagList tagList={question.tagList} />
                <div style={{ marginBottom: 16 }} />
                <MdViewer value={question.content} />
            </Card>
            <div style={{ marginBottom: 16 }} />
            <Card title="推荐答案" bordered={false}>
                <MdViewer value={question.answer} />
            </Card>
        </div>
    );
};

export default QuestionCard;
