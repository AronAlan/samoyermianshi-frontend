"use client";
import { Card, List, Tag } from "antd";
import Link from "next/link";
import "./index.css";
import TagList from "../TagList";

interface Props {
    cardTitle?: React.ReactNode;
    questionList: API.QuestionVO[];
    questionBankId?: number;
}

/**
 * 题目列表组件
 * @param props
 * @constructor
 */
const QuestionList = (props: Props) => {
    const { questionList = [], cardTitle, questionBankId } = props;

    return (
        <Card className="question-list" title={cardTitle}>
            <List
                dataSource={questionList}
                renderItem={(item: API.QuestionVO) => (
                    <List.Item extra={<TagList tagList={item.tagList} />}>
                        <List.Item.Meta
                            title={
                                <Link
                                    href={
                                        questionBankId
                                            ? `/bank/${questionBankId}/question/${item.id}`
                                            : `/question/${item.id}`
                                    }
                                >
                                    {item.title}
                                </Link>
                            }
                        />
                    </List.Item>
                )}
            />
        </Card>
    );
};

export default QuestionList;
