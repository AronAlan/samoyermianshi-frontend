import { useSelector } from "react-redux";
import { RootState } from "@/stores";
import { usePathname } from "next/navigation";
import checkAccess from "@/access/checkAccess";
import Forbidden from "@/app/forbidden";
import React from "react";
import AccessEnum from "@/access/accessEnum";
import { findAllMenuItemByPath } from "../../config/menu";

/**
 * 统一权限校验拦截器
 * @param children
 * @constructor
 */
const AccessLayout: React.FC<
    Readonly<{
        children: React.ReactNode;
    }>
> = ({ children }) => {
    const pathname = usePathname();
    const loginUser = useSelector((state: RootState) => state.loginUser);
    // 权限校验
    const menu = findAllMenuItemByPath(pathname) || {};
    const needAccess = menu?.access ?? AccessEnum.NOT_LOGIN;
    const canAccess = checkAccess(loginUser, needAccess);
    if (!canAccess) {
        return <Forbidden />;
    }
    return children;
};

export default AccessLayout;
