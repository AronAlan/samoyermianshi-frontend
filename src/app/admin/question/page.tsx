"use client";

import {
    batchDeleteQuestionsUsingPost,
    deleteQuestionUsingPost,
    listQuestionByPageUsingPost,
    searchQuestionSimpleVoByPageUsingPost,
    searchQuestionVoByPageUsingPost
} from "@/api/questionController";
import { PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import {
    Button,
    message,
    Popconfirm,
    Space,
    Table,
    Tooltip,
    Typography
} from "antd";
import React, { useRef, useState } from "react";
import CreateModal from "./components/CreateModal";
import UpdateModal from "./components/UpdateModal";
import TagList from "../../../compoents/TagList";
import MdEditor from "@/compoents/MdEditor";
import UpdateBankModal from "./components/UpdateBankModal";
import BatchAddQuestionsToBankModal from "./components/BatchAddQuestionsToBankModal";
import BatchRemoveQuestionsFromBankModal from "./components/BatchRemoveQuestionsFromBankModal";
import TagListBankTitles from "@/compoents/TagListBankTitles";

/**
 * 题库管理页面
 *
 * @constructor
 */
const QuestionAdminPage: React.FC = () => {
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
    // 是否显示批量向题库添加题目弹窗
    const [
        batchAddQuestionsToBankModalVisible,
        setBatchAddQuestionsToBankModalVisible
    ] = useState<boolean>(false);
    // 是否显示批量从题库移除题目弹窗
    const [
        batchRemoveQuestionsFromBankModalVisible,
        setBatchRemoveQuestionsFromBankModalVisible
    ] = useState<boolean>(false);
    // 当前选中的题目 id 列表
    const [selectedQuestionIdList, setSelectedQuestionIdList] = useState<
        number[]
    >([]);

    // 用于传递 onCleanSelected 函数。用于在批量操作题目后，清空批量选择状态
    const cleanSelectedRef = useRef<(event?: MouseEvent) => void>();

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
     * 批量删除
     * @param questionIdList
     */
    const handleBatchDelete = async (questionIdList: number[]) => {
        const hide = message.loading("正在批量删除中");
        try {
            await batchDeleteQuestionsUsingPost({
                questionIdList
            });
            hide();
            message.success("批量删除成功");
            actionRef?.current?.reload();
        } catch (error: any) {
            hide();
            message.error("批量删除失败，" + error.message);
        }
    };

    /**
     * 表格列配置
     */
    const columns: ProColumns<API.QuestionVO>[] = [
        {
            title: "id",
            dataIndex: "id",
            valueType: "text",
            hideInForm: true,
            align: "center"
        },
        {
            title: "搜索标题",
            dataIndex: "searchText",
            valueType: "text",
            hideInForm: true,
            hideInTable: true
        },
        {
            title: "标题",
            dataIndex: "title",
            valueType: "text",
            hideInSearch: true,
            align: "center"
        },
        {
            title: "内容",
            dataIndex: "content",
            valueType: "text",
            hideInSearch: true,
            align: "center",
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
            align: "center",
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
            dataIndex: "tagsList",
            valueType: "select",
            fieldProps: {
                mode: "tags"
            },
            render: (_, record) => {
                return <TagList tagList={record.tagList} />;
            }
        },
        // 题库所属在另一张表中，这里管理员管理题目页面也使用了ES，暂时不设置根据所属题库搜索
        {
            title: "所属题库",
            dataIndex: "questionBankId",
            // hideInTable: true,
            hideInSearch: true,
            hideInForm: true,
            render: (_, record) => {
                return (
                    <TagListBankTitles
                        bankTitleList={record.questionBankTitles}
                    />
                );
            }
        },
        {
            title: "创建用户",
            dataIndex: "userId",
            valueType: "text",
            align: "center",
            width: 100,
            hideInForm: true,
            //设置最大宽度，超过用省略号，并设置鼠标放上去显示全部内容
            onCell: () => {
                return {
                    style: {
                        maxWidth: 150,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        cursor: "pointer"
                    }
                };
            },
            render: (text) => (
                <Tooltip placement="topLeft" title={text}>
                    {text}
                </Tooltip>
            )
        },
        {
            title: "创建时间",
            sorter: true,
            dataIndex: "createTime",
            valueType: "dateTime",
            hideInSearch: true,
            align: "center",
            hideInForm: true
        },
        // {
        //     title: "编辑时间",
        //     sorter: true,
        //     dataIndex: "editTime",
        //     valueType: "dateTime",
        //     hideInSearch: true,
        //     hideInForm: true
        // },
        {
            title: "更新时间",
            sorter: true,
            dataIndex: "updateTime",
            valueType: "dateTime",
            hideInSearch: true,
            align: "center",
            hideInForm: true
        },
        {
            title: "操作",
            dataIndex: "option",
            valueType: "option",
            align: "center",
            width: 190,
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
            <ProTable<API.QuestionVO>
                headerTitle={"题目详情"}
                actionRef={actionRef}
                rowKey="id"
                search={{
                    labelWidth: 120
                }}
                rowSelection={{
                    // 显示下拉选项。提供全选和反选
                    selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT]
                }}
                tableAlertRender={({
                    selectedRowKeys,
                    selectedRows,
                    onCleanSelected
                }) => {
                    // 将onCleanSelected函数存储到cleanSelectedRef中
                    cleanSelectedRef.current = onCleanSelected;
                    return (
                        <Space size={24}>
                            <span>
                                已选 {selectedRowKeys.length} 项
                                <a
                                    style={{ marginInlineStart: 8 }}
                                    onClick={onCleanSelected}
                                >
                                    取消选择
                                </a>
                            </span>
                        </Space>
                    );
                }}
                tableAlertOptionRender={({
                    selectedRowKeys,
                    selectedRows,
                    onCleanSelected
                }) => {
                    return (
                        <Space size={16}>
                            <Button
                                onClick={() => {
                                    // 打开批量添加题目弹窗
                                    setSelectedQuestionIdList(
                                        selectedRowKeys as number[]
                                    );
                                    setBatchAddQuestionsToBankModalVisible(
                                        true
                                    );
                                }}
                            >
                                批量向题库添加题目
                            </Button>
                            <Button
                                onClick={() => {
                                    // 打开批量从题库移除题目弹窗
                                    setSelectedQuestionIdList(
                                        selectedRowKeys as number[]
                                    );
                                    setBatchRemoveQuestionsFromBankModalVisible(
                                        true
                                    );
                                }}
                            >
                                批量从题库移除题目
                            </Button>
                            <Popconfirm
                                title="确认删除"
                                description="你确定要删除这些题目么？"
                                onConfirm={() => {
                                    // 批量删除题目
                                    handleBatchDelete(
                                        selectedRowKeys as number[]
                                    );
                                }}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button danger>批量删除题目</Button>
                            </Popconfirm>
                        </Space>
                    );
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
                    const sortField = Object.keys(sort)?.[0] || "updateTime";
                    const sortOrder = sort?.[sortField] || "descend";

                    //如果当前页的数据已经删除完了，则查询上一页
                    if (currentPage) {
                        params.current = (params.current as any) - 1;
                        setCurrentPage(false);
                    }

                    const { data, code } =
                        (await searchQuestionVoByPageUsingPost({
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
                    actionRef?.current?.reload();
                }}
            />
            <UpdateBankModal
                visible={updateBankModalVisible}
                questionId={currentRow?.id}
                onCancel={() => {
                    setCurrentRow(undefined);
                    setUpdateBankModalVisible(false);
                    actionRef?.current?.reload();
                }}
            />
            <BatchAddQuestionsToBankModal
                visible={batchAddQuestionsToBankModalVisible}
                questionIdList={selectedQuestionIdList}
                onSubmit={() => {
                    setBatchAddQuestionsToBankModalVisible(false);
                    actionRef?.current?.reload();
                    // 调用存储的onCleanSelected函数来清空选择
                    cleanSelectedRef.current?.();
                }}
                onCancel={() => {
                    setBatchAddQuestionsToBankModalVisible(false);
                    actionRef?.current?.reload();
                }}
            />
            <BatchRemoveQuestionsFromBankModal
                visible={batchRemoveQuestionsFromBankModalVisible}
                questionIdList={selectedQuestionIdList}
                onSubmit={() => {
                    setBatchRemoveQuestionsFromBankModalVisible(false);
                    actionRef?.current?.reload();
                    cleanSelectedRef.current?.();
                }}
                onCancel={() => {
                    setBatchRemoveQuestionsFromBankModalVisible(false);
                    actionRef?.current?.reload();
                }}
            />
        </PageContainer>
    );
};
export default QuestionAdminPage;
