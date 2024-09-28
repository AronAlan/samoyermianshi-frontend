"use client";
import { Card, List, Tag } from "antd";
import "./index.css";
import Link from "next/link";
import TagList from "../TagList";

interface Props {
    questionList: API.QuestionVO[];
}

/**
 * 题目列表组件
 * @param props
 * @constructor
 */
const QuestionList = (props: Props) => {
    const { questionList = [] } = props;
    const colors = [
        "red",
        "blue",
        "green",
        "yellow",
        "orange",
        "purple",
        "pink",
        "cyan",
        "gold",
        "magenta"
    ];

    function getRandomColor(): string {
        const index = Math.floor(Math.random() * colors.length);
        return colors[index];
    }
    const tagList = (tags: string[] = []) => {
        return tags.map((tag) => {
            return <Tag key={tag} color={getRandomColor()}>{tag}</Tag>;
        });
    };

    return (
        <Card className="question-list">
            <List
                dataSource={questionList}
                renderItem={(item: API.QuestionVO) => (
                    <List.Item extra={tagList(item.tagList)}>
                        <List.Item.Meta
                            title={
                                <Link href={`/question/${item.id}`}>
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
