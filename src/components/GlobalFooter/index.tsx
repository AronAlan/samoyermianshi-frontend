import './index.css';
/**
 * 全局底部栏组件
 * @returns 
 */
export default function GlobalFooter() {
    const currentYear= new Date().getFullYear();
    return (
        <div className="global-footer">
            <div>© {currentYear} Samoyer面试刷题平台</div>
            <div>by Samoyer</div>
        </div>
    );
}