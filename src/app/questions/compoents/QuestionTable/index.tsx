"use client";

import ProTable, { ActionType, ProColumns } from "@ant-design/pro-table";
import { TablePaginationConfig } from "antd";
import Link from "next/link";
import { useRef, useState } from "react";
import TagList from "../../../../compoents/TagList";
import { listQuestionSimpleVoByPageUsingPost } from "@/api/questionController";

interface Props {
    //默认值，用于展示服务端渲染的数据
    defaultQuestionList?: API.QuestionSimpleVO[];
    defaultTotal?: number;
    // 默认搜索条件
    defaultSearchParams?: API.QuestionQueryRequest;
}

/**
 * 题目表格组件
 * @constructor
 */
export default function QuestionTable(props: Props) {
    const actionRef = useRef<ActionType>();
    const {
        defaultQuestionList,
        defaultTotal,
        defaultSearchParams = {}
    } = props;
    const [questionList, setQuestionList] = useState<API.QuestionSimpleVO[]>(
        defaultQuestionList || []
    );
    const [total, setTotal] = useState<number>(defaultTotal || 0);
    const [init, setInit] = useState<boolean>(true);

    /**
     * 表格列配置
     */
    const columns: ProColumns<API.QuestionSimpleVO>[] = [
        {
            title: "题目",
            dataIndex: "title",
            render(_, record) {
                return (
                    <Link href={`/question/${record.id}`}>{record.title}</Link>
                );
            }
        },
        {
            title: "标签",
            dataIndex: "tagList",
            valueType: "select",
            fieldProps: {
                mode: "tags"
            },
            render: (_, record) => <TagList tagList={record.tagList} />
        }
    ];

    return (
        <div className="question-table">
            <ProTable
                actionRef={actionRef}
                columns={columns}
                rowKey="id"
                size="large"
                search={{
                    labelWidth: "auto"
                }}
                form={{
                    initialValues: defaultSearchParams
                }}
                dataSource={questionList}
                pagination={
                    {
                        pageSize: 15,
                        showTotal: (total) => `总共 ${total} 条`,
                        showSizeChanger: false,
                        total
                    } as TablePaginationConfig
                }
                request={async (params, sort, filter) => {
                    // 首次请求
                    if (init) {
                        setInit(false);
                        // 如果已有外层传来的默认数据，无需再次查询
                        if (defaultQuestionList && defaultTotal) {
                            return {
                                data: defaultQuestionList,
                                success: true,
                                total: defaultTotal
                            };
                        }
                    }

                    const sortField = Object.keys(sort)?.[0] || "createTime";
                    const sortOrder = sort?.[sortField] || "descend";
                    // 请求
                    const { data, code } =
                        (await listQuestionSimpleVoByPageUsingPost({
                            ...params,
                            sortField,
                            sortOrder,
                            ...filter
                        } as API.QuestionQueryRequest)) as any;
                    // 更新结果
                    const newTotal = Number(data.total) || 0;
                    setTotal(newTotal);
                    const newData = data.records || [];
                    setQuestionList(newData);
                    return {
                        success: code === 0,
                        data: newData,
                        total: newTotal
                    };
                }}
            />
        </div>
    );
}
