import { listQuestionBankVoByPageUsingPost } from "@/api/questionBankController";
import {
    addQuestionBankQuestionUsingPost,
    listQuestionBankQuestionByPageUsingPost,
    removeQuestionBankQuestionUsingPost
} from "@/api/questionBankQuestionController";
import { updateQuestionUsingPost } from "@/api/questionController";
import { ProColumns, ProTable } from "@ant-design/pro-components";
import { Form, message, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";

interface Props {
    questionId?: number;
    visible: boolean;
    onCancel: () => void;
}

/**
 * 更新弹窗
 * @param props
 * @constructor
 */
const UpdateModal: React.FC<Props> = (props) => {
    const { questionId, visible, onCancel } = props;
    const [form] = Form.useForm();
    const [questionBankList, setQuestionBankList] = useState<
        API.QuestionBankVO[]
    >([]);

    // 获取所属题库列表
    const getCurrentQuestionBankIdList = async () => {
        try {
            const res = (await listQuestionBankQuestionByPageUsingPost({
                questionId,
                pageSize: 20
            })) as any;
            const list = (res.data.records ?? []).map(
                (item: any) => item.questionBankId
            );
            form.setFieldValue("questionBankIdList" as any, list);
        } catch (e: any) {
            console.error("获取题目所属题库列表失败，" + e.message);
        }
    };

    useEffect(() => {
        if (questionId) {
            getCurrentQuestionBankIdList();
        }
    }, [questionId]);

    // 获取题库列表，用于修改时供管理员选择
    const getQuestionBankList = async () => {
        // 题库数量不多，直接全量获取
        const pageSize = 200;
        try {
            const questionBankRes = (await listQuestionBankVoByPageUsingPost({
                pageSize,
                sortField: "createTime",
                sortOrder: "descend"
            })) as any;
            setQuestionBankList(questionBankRes.data.records ?? []);
        } catch (e: any) {
            console.error("获取题库列表失败，" + e.message);
        }
    };

    useEffect(() => {
        getQuestionBankList();
    }, []);

    return (
        <Modal
            destroyOnClose
            title={"更新所属题库"}
            open={visible}
            footer={null}
            onCancel={() => {
                onCancel?.();
            }}
        >
            <Form form={form} style={{ marginTop: 24 }}>
                <Form.Item label="所属题库" name="questionBankIdList">
                    <Select
                        mode="multiple"
                        style={{ width: "100%" }}
                        onSelect={async (value) => {
                            const hide = message.loading("正在更新");
                            try {
                                await addQuestionBankQuestionUsingPost({
                                    questionId,
                                    questionBankId: value
                                });
                                hide();
                                message.success("绑定题库成功");
                            } catch (error: any) {
                                hide();
                                message.error("绑定题库失败，" + error.message);
                            }
                        }}
                        onDeselect={async (value) => {
                            const hide = message.loading("正在更新");
                            try {
                                await removeQuestionBankQuestionUsingPost({
                                    questionId,
                                    questionBankId: value
                                });
                                hide();
                                message.success("取消绑定题库成功");
                            } catch (error: any) {
                                hide();
                                message.error(
                                    "取消绑定题库失败，" + error.message
                                );
                            }
                        }}
                        options={questionBankList.map((questionBank) => {
                            return {
                                label: questionBank.title,
                                value: questionBank.id
                            };
                        })}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};
export default UpdateModal;
