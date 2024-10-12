import { Tag } from "antd";
import "./index.css";

interface Props {
    bankTitleList?: string[];
}

/**
 * 标签列表组件
 * @param props
 * @constructor
 */
const TagListBankTitles = (props: Props) => {
    const { bankTitleList = [] } = props;
    const colors = [
        "red",
        "blue",
        "green",
        "yellow",
        "orange",
        "purple",
        "pink",
        "cyan",
        "gold",
        "magenta"
    ];

    function getRandomColor(): string {
        const index = Math.floor(Math.random() * colors.length);
        return colors[index];
    }

    return (
        <div className="tagbanktitles-list">
            {bankTitleList && bankTitleList.length > 0 ? (
                bankTitleList.map((bankTitle) => {
                    const randomColor = getRandomColor();
                    return (
                        <Tag key={bankTitle} color={randomColor}>
                            {bankTitle}
                        </Tag>
                    );
                })
            ) : (
                <div>未分配题库</div>
            )}
        </div>
    );
};

export default TagListBankTitles;
