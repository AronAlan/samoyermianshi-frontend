"use client";

import {
    deleteQuestionBankUsingPost,
    listQuestionBankByPageUsingPost
} from "@/api/questionBankController";
import { PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Button, message, Popconfirm, Space, Typography } from "antd";
import React, { useRef, useState } from "react";
import CreateModal from "./components/CreateModal";
import UpdateModal from "./components/UpdateModal";

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
    const [currentRow, setCurrentRow] = useState<API.QuestionBank>();
    // 用于删除数据后当前页没有数据了，则返回表格上一页
    const [currentPageTotal, setCurrentPageTotal] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<boolean>(false);

    /**
     * 删除节点
     *
     * @param row
     */
    const handleDelete = async (row: API.QuestionBank) => {
        const hide = message.loading("正在删除");
        if (!row) return true;
        try {
            await deleteQuestionBankUsingPost({
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
    const columns: ProColumns<API.QuestionBank>[] = [
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
            title: "描述",
            dataIndex: "description",
            valueType: "text"
        },
        {
            title: "图片",
            dataIndex: "picture",
            valueType: "image",
            fieldProps: {
                width: 64
            },
            hideInSearch: true
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
            <ProTable<API.QuestionBank>
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

                    const { data, code } =
                        (await listQuestionBankByPageUsingPost({
                            ...params,
                            sortField,
                            sortOrder,
                            ...filter
                        } as API.QuestionBankQueryRequest)) as any;
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
        </PageContainer>
    );
};
export default BankAdminPage;
