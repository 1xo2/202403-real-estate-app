import { AiOutlineExclamationCircle, AiOutlineInfoCircle } from 'react-icons/ai';
import { CgDanger } from 'react-icons/cg';
import "./ModalDialogOkCancel.css";

type Props = {
    message: string
    onOK: () => void
    onCancel?: () => void
    type?: "info" | "danger" | "alert";
    isDialogVisible: boolean;
    setIsDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalDialogOkCancel = ({ message, onOK, onCancel, type, isDialogVisible, setIsDialogVisible }: Props) => {


    const handleOK = () => {
        setIsDialogVisible(false);
        onOK();
    };

    const handleCancel = () => {
        setIsDialogVisible(false);
        onCancel && onCancel();
    };

    if (!isDialogVisible) {
        return null; // Don't render anything if not visible
    }
    // Determine icon and title based on the type
    let IconComponent;
    let title;
    switch (type) {
        case "info":
            IconComponent = AiOutlineInfoCircle;
            title = "Info";
            break;
        case "danger":
            IconComponent = CgDanger;
            title = "Danger";
            break;
        case "alert":
            IconComponent = AiOutlineExclamationCircle;
            title = "Alert";
            break;
        default:
            IconComponent = AiOutlineInfoCircle;
            title = "Info";
            break;
    }

    return (
        <div className="overlay">
            <div className={`overlay-dialog ${type}`}>
                <div className={`icon ${type}`}>
                    <IconComponent />
                </div>
                <h3 className={`title ${type}`}>{title}</h3>
                <p className="message">{message}</p>
                <div className="buttons">
                    <button onClick={handleOK}>OK</button>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};



export default ModalDialogOkCancel;
