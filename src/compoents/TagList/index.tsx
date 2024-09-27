import { Tag } from "antd";
import "./index.css";

interface Props {
    tagList?: string[];
}

/**
 * 标签列表组件
 * @param props
 * @constructor
 */
const TagList = (props: Props) => {
    const { tagList = [] } = props;
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
        <div className="tag-list">
            {tagList.map((tag) => {
                const randomColor = getRandomColor();
                return (
                    <Tag key={tag} color={randomColor}>
                        {tag}
                    </Tag>
                );
            })}
        </div>
    );
};

export default TagList;
