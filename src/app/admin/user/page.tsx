"use client";

import CreateModal from "./components/CreateModal";
import UpdateModal from "./components/UpdateModal";
import {
    deleteUserUsingPost,
    listUserByPageUsingPost
} from "@/api/userController";
import { PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Button, message, Popconfirm, Space, Typography } from "antd";
import React, { useRef, useState } from "react";

/**
 * 用户管理页面
 *
 * @constructor
 */
const UserAdminPage: React.FC = () => {
    // 是否显示新建窗口
    const [createModalVisible, setCreateModalVisible] =
        useState<boolean>(false);
    // 是否显示更新窗口
    const [updateModalVisible, setUpdateModalVisible] =
        useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    // 当前用户点击的数据
    const [currentRow, setCurrentRow] = useState<API.User>();
    // 用于删除数据后当前页没有数据了，则返回表格上一页
    const [currentPageTotal, setCurrentPageTotal] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<boolean>(false);

    /**
     * 删除节点
     *
     * @param row
     */
    const handleDelete = async (row: API.User) => {
        const hide = message.loading("正在删除");
        if (!row) return true;
        try {
            await deleteUserUsingPost({
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
    const columns: ProColumns<API.User>[] = [
        {
            title: "id",
            dataIndex: "id",
            valueType: "text",
            hideInForm: true
        },
        {
            title: "账号",
            dataIndex: "userAccount",
            valueType: "text"
        },
        {
            title: "用户名",
            dataIndex: "userName",
            valueType: "text"
        },
        {
            title: "头像",
            dataIndex: "userAvatar",
            valueType: "image",
            fieldProps: {
                width: 64
            },
            hideInSearch: true
        },
        {
            title: "简介",
            dataIndex: "userProfile",
            valueType: "textarea"
        },
        {
            title: "权限",
            dataIndex: "userRole",
            valueEnum: {
                user: {
                    text: "用户"
                },
                admin: {
                    text: "管理员"
                }
            }
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
            <ProTable<API.User>
                headerTitle={"用户详情"}
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

                    // 不加 as any的话，会报类型错误，但不影响运行
                    // 因为TS并不知道返回结果里有没有这两个属性，因此我们要让TS知道是有这两个属性的，所以可以直接使用断言解决。
                    /*const { data, code } = (await listUserByPageUsingPost({
                        ...params,
                        sortField,
                        sortOrder,
                        ...filter
                    } as API.UserQueryRequest));*/

                    const { data, code } = (await listUserByPageUsingPost({
                        ...params,
                        sortField,
                        sortOrder,
                        ...filter
                    } as API.UserQueryRequest)) as any;
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
export default UserAdminPage;
