"use client";

import getAccessibleMenus from "@/access/menuAccess";
import {
    addUserSignInUsingPost,
    userLogoutUsingPost
} from "@/api/userController";
import GlobalFooter from "@/compoents/GlobalFooter";
import { DEFAULT_USER } from "@/constants/user";
import { AppDispatch, RootState } from "@/stores";
import { setLoginUser } from "@/stores/loginUser";
import { GithubFilled, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { ProLayout } from "@ant-design/pro-components";
import { Button, Dropdown, message } from "antd";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { menus } from "../../../config/menu";
import SearchInput from "./components/SearchInput";
import "./index.css";

interface Props {
    children: React.ReactNode;
}

// 虽然能解决其中一个水合报错，但会影响服务端渲染，预览中无法查看
// const ProLayout = dynamic(
//     () => {
//         return import("@ant-design/pro-layout");
//     },
//     {
//         ssr: false //仅在客户端渲染
//     }
// );

/**
 * 全局通用布局
 * @returns
 */
export default function BasicLayout({ children }: Props) {
    const pathname = usePathname();
    const loginUser = useSelector((state: RootState) => state.loginUser);
    const router = useRouter() as any;
    const dispatch = useDispatch<AppDispatch>();

    /**
     * 用户注销
     */
    const userLogout = async () => {
        try {
            await userLogoutUsingPost();
            message.success("已退出登录");
            dispatch(setLoginUser(DEFAULT_USER));
            router.push("/user/login");
        } catch (e: any) {
            message.error("注销失败，" + e.message);
        }
    };

    const checkIn = async () => {
        // 请求后端执行签到
        try {
            const res = (await addUserSignInUsingPost({})) as any;
            //如果res的data是true的话，显示已签到
            if (res.data) {
                message.success("今日已经签到过啦~请勿重复签到~");
            } else {
                message.success("签到成功！");
            }
        } catch (e: any) {
            message.error("签到失败，" + e.message);
        }
    };

    return (
        <div
            id="basicLayout"
            style={{
                height: "100vh",
                overflow: "auto"
            }}
        >
            <ProLayout
                title="面试熊刷题平台"
                layout="top"
                logo={
                    <Image
                        src="/assets/bubu.jpeg"
                        //设置图片大小
                        width={32}
                        height={32}
                        alt="面试熊刷题平台 - 程序员Samoyer"
                    />
                }
                location={{
                    pathname
                }}
                avatarProps={{
                    src: loginUser.userAvatar || "/assets/notlogin.png",
                    size: "small",
                    title: loginUser.userName || "未登录",
                    render: (props, dom) => {
                        if (!loginUser.id) {
                            return (
                                <div onClick={() => router.push("/user/login")}>
                                    {dom}
                                </div>
                            );
                        }
                        return (
                            <Dropdown
                                menu={{
                                    items: [
                                        {
                                            key: "userCenter",
                                            icon: <UserOutlined />,
                                            label: "个人中心"
                                        },
                                        {
                                            key: "logout",
                                            icon: <LogoutOutlined />,
                                            label: "退出登录"
                                        }
                                    ],
                                    onClick: async (event: {
                                        key: React.Key;
                                    }) => {
                                        const { key } = event;
                                        if (key === "logout") {
                                            userLogout();
                                        } else if (key === "userCenter") {
                                            router.push("/user/center");
                                        }
                                    }
                                }}
                            >
                                {dom}
                            </Dropdown>
                        );
                    }
                }}
                actionsRender={(props) => {
                    if (props.isMobile) return [];
                    return [
                        ...(pathname.includes("/questions")
                            ? []
                            : [<SearchInput key="search" />]),
                        <a
                            key="github"
                            href="https://github.com/AronAlan/samoyermianshi-frontend"
                            target="_blank"
                        >
                            <GithubFilled key="GithubFilled" />
                        </a>,
                        // 添加签到按钮，未登录时不显示
                        loginUser.id && (
                            <Button
                                key="signIn"
                                type="primary"
                                style={{ marginLeft: 12 }}
                                onClick={checkIn}
                            >
                                签到
                            </Button>
                        )
                    ];
                }}
                headerTitleRender={(logo, title, _) => {
                    return (
                        <a>
                            {logo}
                            {title}
                        </a>
                    );
                }}
                // 底部渲染
                footerRender={() => {
                    return <GlobalFooter />;
                }}
                onMenuHeaderClick={(e) => console.log(e)}
                // 菜单项数据
                menuDataRender={() => {
                    return getAccessibleMenus(loginUser, menus);
                }}
                // 菜单渲染
                menuItemRender={(item, dom) => (
                    <Link href={item.path || "/"} target={item.target}>
                        {dom}
                    </Link>
                )}
            >
                {children}
            </ProLayout>
        </div>
    );
}
