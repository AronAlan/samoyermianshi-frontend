import { updateQuestionUsingPost } from "@/api/questionController";
import { ProColumns, ProTable } from "@ant-design/pro-components";
import { message, Modal } from "antd";
import React from "react";

interface Props {
    oldData?: API.Question;
    visible: boolean;
    columns: ProColumns<API.Question>[];
    onSubmit: (values: API.QuestionAddRequest) => void;
    onCancel: () => void;
}

/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: API.QuestionUpdateRequest) => {
    const hide = message.loading("正在更新");
    try {
        await updateQuestionUsingPost(fields);
        hide();
        message.success("更新成功");
        return true;
    } catch (error: any) {
        hide();
        message.error("更新失败，" + error.message);
        return false;
    }
};

/**
 * 更新弹窗
 * @param props
 * @constructor
 */
const UpdateModal: React.FC<Props> = (props) => {
    const { oldData, visible, columns, onSubmit, onCancel } = props;

    if (!oldData) {
        return <></>;
    }
    //表单转换，将tags转换为数组后作为回显的初始值
    const initialValues = { ...oldData };
    if (oldData.tags) {
        initialValues.tags = JSON.parse(oldData.tags) || [];
    }

    return (
        <Modal
            destroyOnClose
            title={"更新"}
            open={visible}
            footer={null}
            onCancel={() => {
                onCancel?.();
            }}
        >
            <ProTable
                type="form"
                columns={columns}
                form={{
                    initialValues: initialValues
                }}
                onSubmit={async (values: API.QuestionAddRequest) => {
                    const success = await handleUpdate({
                        ...values,
                        id: oldData.id as any
                    });
                    if (success) {
                        onSubmit?.(values);
                    }
                }}
            />
        </Modal>
    );
};
export default UpdateModal;
