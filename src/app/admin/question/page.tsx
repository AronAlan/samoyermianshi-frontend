"use client";

import {
    deleteQuestionUsingPost,
    listQuestionByPageUsingPost
} from "@/api/questionController";
import { PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Button, message, Popconfirm, Space, Typography } from "antd";
import React, { useRef, useState } from "react";
import CreateModal from "./components/CreateModal";
import UpdateModal from "./components/UpdateModal";
import TagList from "../../../compoents/TagList";
import MdEditor from "@/compoents/MdEditor";
import UpdateBankModal from "./components/UpdateBankModal";

/**
 * 题库管理页面
 *
 * @constructor
 */
const BankAdminPage: React.FC = () => {
    // 是否显示新建窗口
    const [createModalVisible, setCreateModalVisible] =
        useState<boolean>(false);
    // 是否显示更新窗口
    const [updateModalVisible, setUpdateModalVisible] =
        useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    // 当前用户点击的数据
    const [currentRow, setCurrentRow] = useState<API.Question>();
    // 用于删除数据后当前页没有数据了，则返回表格上一页
    const [currentPageTotal, setCurrentPageTotal] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<boolean>(false);
    // 是否显示更新所属题库的弹窗
    const [updateBankModalVisible, setUpdateBankModalVisible] =
        useState<boolean>(false);

    /**
     * 删除节点
     *
     * @param row
     */
    const handleDelete = async (row: API.Question) => {
        const hide = message.loading("正在删除");
        if (!row) return true;
        try {
            await deleteQuestionUsingPost({
                id: row.id as any
            });
            hide();
            //如果currentPageTotal超过20，并且对20取余等于1的话，就返回上一页
            const isLastPage = currentPageTotal % 20 === 1;
            if (currentPageTotal > 20 && isLastPage) {
                // 返回表格上一页
                setCurrentPage(true);
            }
            message.success("删除成功");
            actionRef?.current?.reload();
            return true;
        } catch (error: any) {
            hide();
            message.error("删除失败，" + error.message);
            return false;
        }
    };

    /**
     * 表格列配置
     */
    const columns: ProColumns<API.Question>[] = [
        {
            title: "id",
            dataIndex: "id",
            valueType: "text",
            hideInForm: true
        },
        {
            title: "标题",
            dataIndex: "title",
            valueType: "text"
        },
        {
            title: "所属题库",
            dataIndex: "questionBankId",
            hideInTable: true,
            hideInForm: true
        },
        {
            title: "内容",
            dataIndex: "content",
            valueType: "text",
            hideInSearch: true,
            width: 240,
            //修改数据时，将此项的输入框变为markdown
            renderFormItem: (
                _,
                {
                    type,
                    defaultRender,
                    formItemProps,
                    fieldProps,
                    ...rest
                }: any, //加个any，否则会报错（vscode报）
                form
            ) => {
                return (
                    // value 和 onchange 会通过 form 自动注入。
                    <MdEditor
                        // 组件的配置
                        {...fieldProps}
                    />
                );
            }
        },
        {
            title: "答案",
            dataIndex: "answer",
            valueType: "text",
            hideInSearch: true,
            width: 640,
            //修改数据时，将此项的输入框变为markdown
            renderFormItem: (
                _,
                {
                    type,
                    defaultRender,
                    formItemProps,
                    fieldProps,
                    ...rest
                }: any,
                form
            ) => {
                return <MdEditor {...fieldProps} />;
            }
        },
        {
            title: "标签",
            dataIndex: "tags",
            valueType: "select",
            fieldProps: {
                mode: "tags"
            },
            //把字符串转为标签列表
            render: (_, record) => {
                const tagList = JSON.parse(record.tags || "[]");
                return <TagList tagList={tagList} />;
            }
        },
        {
            title: "创建用户",
            dataIndex: "userId",
            valueType: "text",
            hideInForm: true
        },

        {
            title: "创建时间",
            sorter: true,
            dataIndex: "createTime",
            valueType: "dateTime",
            hideInSearch: true,
            hideInForm: true
        },
        {
            title: "编辑时间",
            sorter: true,
            dataIndex: "editTime",
            valueType: "dateTime",
            hideInSearch: true,
            hideInForm: true
        },
        {
            title: "更新时间",
            sorter: true,
            dataIndex: "updateTime",
            valueType: "dateTime",
            hideInSearch: true,
            hideInForm: true
        },
        {
            title: "操作",
            dataIndex: "option",
            valueType: "option",
            render: (_, record) => (
                <Space size="middle">
                    <Typography.Link
                        onClick={() => {
                            setCurrentRow(record);
                            setUpdateModalVisible(true);
                        }}
                    >
                        修改
                    </Typography.Link>
                    <Typography.Link
                        onClick={() => {
                            setCurrentRow(record);
                            setUpdateBankModalVisible(true);
                        }}
                    >
                        修改所属题库
                    </Typography.Link>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={() => handleDelete(record)}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Typography.Link type="danger">删除</Typography.Link>
                    </Popconfirm>
                </Space>
            )
        }
    ];
    return (
        <PageContainer>
            <ProTable<API.Question>
                headerTitle={"查询表格"}
                actionRef={actionRef}
                rowKey="id"
                search={{
                    labelWidth: 120
                }}
                toolBarRender={() => [
                    <Button
                        type="primary"
                        key="primary"
                        onClick={() => {
                            setCreateModalVisible(true);
                        }}
                    >
                        <PlusOutlined /> 新建
                    </Button>
                ]}
                request={async (params, sort, filter) => {
                    const sortField = Object.keys(sort)?.[0];
                    const sortOrder = sort?.[sortField] ?? undefined;

                    //如果当前页的数据已经删除完了，则查询上一页
                    if (currentPage) {
                        params.current = (params.current as any) - 1;
                        setCurrentPage(false);
                    }

                    const { data, code } = (await listQuestionByPageUsingPost({
                        ...params,
                        sortField,
                        sortOrder,
                        ...filter
                    } as API.QuestionQueryRequest)) as any;
                    setCurrentPageTotal(Number(data?.total) || 0); // 设置当前页的数据总数
                    return {
                        success: code === 0,
                        data: data?.records || [],
                        total: Number(data?.total) || 0
                    };
                }}
                columns={columns}
            />
            <CreateModal
                visible={createModalVisible}
                columns={columns}
                onSubmit={() => {
                    setCreateModalVisible(false);
                    actionRef.current?.reload();
                }}
                onCancel={() => {
                    setCreateModalVisible(false);
                }}
            />
            <UpdateModal
                visible={updateModalVisible}
                columns={columns}
                oldData={currentRow}
                onSubmit={() => {
                    setUpdateModalVisible(false);
                    setCurrentRow(undefined);
                    actionRef.current?.reload();
                }}
                onCancel={() => {
                    setUpdateModalVisible(false);
                }}
            />
            <UpdateBankModal
                visible={updateBankModalVisible}
                questionId={currentRow?.id}
                onCancel={() => {
                    setCurrentRow(undefined);
                    setUpdateBankModalVisible(false);
                }}
            />
        </PageContainer>
    );
};
export default BankAdminPage;
