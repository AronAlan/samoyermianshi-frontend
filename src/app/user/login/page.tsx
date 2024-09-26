"use client";

import React from "react";
import { LoginForm, ProForm, ProFormText } from "@ant-design/pro-form";
import { message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { userLoginUsingPost } from "@/api/userController";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AppDispatch } from "@/stores";
import { useDispatch } from "react-redux";
import "./index.css";
import { setLoginUser } from "@/stores/loginUser";

/**
 * 用户登录页面
 * @param props
 */
const UserLoginPage: React.FC = (props) => {
    const [form] = ProForm.useForm();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    /**
     * 提交
     * @param values
     */
    const doSubmit = async (values: any) => {
        try {
            const res = await userLoginUsingPost(values);
            if (res.data) {
                message.success("登录成功！");
                // 保存用户登录态
                dispatch(setLoginUser(res.data as API.LoginUserVO));
                router.replace("/");
                form.resetFields();
            }
        } catch (e: any) {
            message.error("登录失败，" + e.message);
        }
    };

    return (
        <div id="userLoginPage">
            <LoginForm<API.UserAddRequest>
                form={form}
                logo={
                    <Image
                        src="/assets/bubu.jpeg"
                        alt="bubu"
                        width={44}
                        height={44}
                    />
                }
                title="面试熊 - 用户登录"
                subTitle={
                    <>
                        面试熊刷题平台
                        <br />
                        <br />
                        雄关漫道真如铁,而今迈步从头越
                    </>
                }
                onFinish={doSubmit}
                submitter={{
                    searchConfig: {
                        submitText: "登录"
                    }
                }}
            >
                <ProFormText
                    name="userAccount"
                    fieldProps={{
                        size: "large",
                        prefix: <UserOutlined />
                    }}
                    placeholder={"请输入用户账号"}
                    rules={[
                        {
                            required: true,
                            message: "请输入用户账号!"
                        }
                    ]}
                />
                <ProFormText.Password
                    name="userPassword"
                    fieldProps={{
                        size: "large",
                        prefix: <LockOutlined />
                    }}
                    placeholder={"请输入密码"}
                    rules={[
                        {
                            required: true,
                            message: "请输入密码！"
                        }
                    ]}
                />
                <div
                    style={{
                        marginBlockEnd: 24,
                        textAlign: "end"
                    }}
                >
                    还没有账号？
                    <Link prefetch={false} href={"/user/register"}>
                        去注册
                    </Link>
                </div>
            </LoginForm>
        </div>
    );
};

export default UserLoginPage;
