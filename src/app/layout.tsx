"use client";

import AccessLayout from "@/access/AccessLayout";
import { getLoginUserUsingGet } from "@/api/userController";
import BasicLayout from "@/layouts/BasicLayout";
import store, { AppDispatch } from "@/stores";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { usePathname } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import "./globals.css";

/**
 * 初始化布局（多封装一层，使得能调用 useDispatch）
 * @param children
 * @constructor
 */
const InitLayout: React.FC<
    Readonly<{
        children: React.ReactNode;
    }>
> = ({ children }) => {
    const dispatch = useDispatch<AppDispatch>();
    // 获取当前页面路径
    const pathname = usePathname();
    // 初始化全局用户状态
    const doInitLoginUser = useCallback(async () => {
        // 获取用户信息
        const res = await getLoginUserUsingGet();

        // 如果不是登录页面和注册页面，则获取全局用户状态
        if (
            !pathname.startsWith("/user/login") &&
            !pathname.startsWith("/user/register")
        ) {
            if (res.data) {
                //更新全局用户状态
                // dispatch(setLoginUser(res.data));
            } else {
                // todo 测试代码，实际可删除
                // setTimeout(() => {
                //     const testUser = {
                //         userName: "测试登录",
                //         id: 1,
                //         userAvatar:
                //             "https://k.sinaimg.cn/n/sinakd20108/640/w1920h1920/20231029/c15f-556f55804622cbd35da5f2eccc7e1b0c.jpg/w700d1q75cms.jpg",
                //         userRole: ACCESS_ENUM.ADMIN
                //     };
                //     dispatch(setLoginUser(testUser));
                // }, 3000);
            }
        }
    }, []);

    useEffect(() => {
        doInitLoginUser();
    }, []);
    return children;
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="zh">
            <body>
                <AntdRegistry>
                    <Provider store={store}>
                        <InitLayout>
                            <BasicLayout>
                                <AccessLayout>{children}</AccessLayout>
                            </BasicLayout>
                        </InitLayout>
                    </Provider>
                </AntdRegistry>
            </body>
        </html>
    );
}
