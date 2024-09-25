"use client";

import { useSelector } from "react-redux";
import "./index.css";
import { RootState } from "@/stores";
import { useRouter } from "next/navigation";
import { message } from "antd";
import ACCESS_ENUM from "@/access/accessEnum";

/**
 * 题目页面
 * @returns
 */
export default function questionsPage() {
    const loginUser = useSelector((state: RootState) => state.loginUser);
    const router = useRouter();

    if (loginUser.userRole === ACCESS_ENUM.NOT_LOGIN) {
        message.warning("期待您登录后的使用~");
        router.push("/user/login"); // 跳转到登录页面
    }

    return (
        <div id="questionsPage">
            <h1>题目页面</h1>
        </div>
    );
}
