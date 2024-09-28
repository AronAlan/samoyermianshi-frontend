import { listQuestionBankVoByPageUsingPost } from "@/api/questionBankController";
import { listQuestionVoByPageUsingPost } from "@/api/questionController";
import QuestionBankList from "@/compoents/QuestionBankList";
import QuestionList from "@/compoents/QuestionList";
import { Card, Divider, Flex } from "antd";
import Title from "antd/es/typography/Title";
import Link from "next/link";
import "./index.css";

// 本页面使用服务端渲染，禁用静态生成
export const dynamic = "force-dynamic";

/**
 * 主页
 * @constructor
 */
export default async function HomePage() {
    let questionBankList = [];
    let questionList = [];

    try {
        const questionBankRes = (await listQuestionBankVoByPageUsingPost({
            pageSize: 12,
            sortField: "createTime",
            sortOrder: "descend"
        })) as any;
        questionBankList = questionBankRes.data.records ?? [];
    } catch (e: any) {
        console.error("获取题库列表失败，" + e.message);
    }

    try {
        const questionListRes = (await listQuestionVoByPageUsingPost({
            pageSize: 12,
            sortField: "createTime",
            sortOrder: "descend"
        })) as any;
        questionList = questionListRes.data.records ?? [];
    } catch (e: any) {
        console.error("获取题目列表失败，" + e.message);
    }
    return (
        <div id="homePage" className="max-width-content">
            <Card
                style={{
                    borderRadius: 8
                }}
            >
                <div>
                    <div
                        style={{
                            fontSize: "30px",
                            fontWeight: "bold",
                            textAlign: "center"
                        }}
                    >
                        ❤️欢迎使用 面试熊刷题平台❤️
                    </div>
                    <p
                        style={{
                            fontSize: "20px",
                            color: "black",
                            lineHeight: "40px",
                            marginTop: 40,
                            textAlign: "center"
                        }}
                    >
                        🚀 面试熊刷题平台
                        提供丰富的面试题目，帮您快速找到最合适的题目，帮您快速了解题目知识点
                        🚀
                    </p>
                    <p
                        style={{
                            fontSize: "20px",
                            color: "black",
                            lineHeight: "40px",
                            textAlign: "center"
                        }}
                    >
                        🌐 致力于为用户提供热门面试题 🌐
                    </p>
                    <p
                        style={{
                            fontSize: "30px",
                            color: "black",
                            lineHeight: "40px",
                            marginTop: 30,
                            textAlign: "center",
                            fontFamily: "ZoomlaWenzhengming-A064" // 使用自定义字体
                        }}
                    >
                        雄关漫道真如铁，而今迈步从头越
                    </p>
                    <p
                        style={{
                            fontSize: "18px",
                            lineHeight: "40px",
                            marginTop: 30,
                            textAlign: "center"
                        }}
                    >
                        在法律允许的范围内，在此声明，本平台仅用于交流学习，不用于商业用途。不承担用户或任何人士因本网站所提供的信息或任何链接所引致的任何直接、间接、附带、从属、特殊、惩罚性或惩戒性的损害赔偿（包括但不限于收益、预期利润的损失或失去的业务）。
                    </p>
                    <p
                        style={{
                            fontSize: "18px",
                            lineHeight: "40px",
                            textAlign: "center"
                        }}
                    >
                        本网站图片，题目和答案，皆源于互联网，由作者整理，如果侵犯，请及时通知我们，本网站将在第一时间及时删除。
                    </p>
                </div>
            </Card>

            <Divider />

            <Flex justify="space-between" align="center">
                <Title level={3}>最新题库</Title>
                <Link href={"/banks"}>查看更多</Link>
            </Flex>
            <QuestionBankList questionBankList={questionBankList} />

            <Divider />

            <Flex justify="space-between" align="center">
                <Title level={3}>最新题目</Title>
                <Link href={"/questions"}>查看更多</Link>
            </Flex>
            <QuestionList questionList={questionList} />
        </div>
    );
}
