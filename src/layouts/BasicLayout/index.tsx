"use client";

import GlobalFooter from "@/components/GlobalFooter";
import {
    GithubFilled,
    LogoutOutlined,
    SearchOutlined
} from "@ant-design/icons";
import { Dropdown, Input, theme } from "antd";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import menus from "../../../config/menu";
import "./index.css";
import { useSelector } from "react-redux";
import { RootState } from "@/stores";

const SearchInput = () => {
    const { token } = theme.useToken();
    return (
        <div
            key="SearchOutlined"
            aria-hidden
            style={{
                display: "flex",
                alignItems: "center",
                marginInlineEnd: 24
            }}
            onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
            }}
        >
            <Input
                style={{
                    borderRadius: 4,
                    marginInlineEnd: 12,
                    backgroundColor: token.colorBgTextHover
                }}
                prefix={
                    <SearchOutlined
                        style={{
                            color: token.colorTextLightSolid
                        }}
                    />
                }
                placeholder="搜索题目"
                variant="borderless"
            />
        </div>
    );
};

interface Props {
    children: React.ReactNode;
}

const ProLayout = dynamic(
    () => {
        return import("@ant-design/pro-layout");
    },
    {
        ssr: false //仅在客户端渲染
    }
);

/**
 * 全局通用布局
 * @returns
 */
export default function BasicLayout({ children }: Props) {
    const pathname = usePathname();
    const loginUser = useSelector((state: RootState) => state.loginUser);
    return (
        <div
            id="basicLayout"
            style={{
                height: "100vh",
                overflow: "auto"
            }}
        >
            <ProLayout
                title="Samoyer面试刷题平台"
                layout="top"
                logo={
                    <Image
                        src="/assets/samoye.png"
                        //设置图片大小
                        width={32}
                        height={32}
                        alt="Samoyer面试刷题平台 - 程序员Samoyer"
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
                        return (
                            <Dropdown
                                menu={{
                                    items: [
                                        {
                                            key: "logout",
                                            icon: <LogoutOutlined />,
                                            label: "测试按钮"
                                        },
                                        {
                                            key: "logout",
                                            icon: <LogoutOutlined />,
                                            label: "退出登录"
                                        }
                                    ]
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
                        <SearchInput key="search" />,
                        <a
                            key="github"
                            href="https://github.com/AronAlan/samoyermianshi-frontend"
                            target="_blank"
                        >
                            <GithubFilled key="GithubFilled" />
                        </a>
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
                    return menus;
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
