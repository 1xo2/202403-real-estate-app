import { AiOutlineExclamationCircle, AiOutlineInfoCircle } from 'react-icons/ai';
import { CgDanger } from 'react-icons/cg';
import "./ModalDialogOkCancel.css";

type Props = {
    message: string
    onOK?: () => void
    onCancel?: () => void
    type?: "info" | "danger" | "alert";
    isDialogVisible: boolean;
    setIsDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
}
/**
 * Renders a modal dialog with an OK and Cancel button.
 *
 * @param {Props} props - The component props.
 * @param {string} props.message - The message to be displayed in the dialog.
 * @param {() => void} props.onOK - The function to be called when the OK button is clicked.
 * @param {() => void} [props.onCancel] - The function to be called when the Cancel button is clicked.
 * @param {"info" | "danger" | "alert"} [props.type="info"] - The type of the dialog, determining the icon and title.
 * @param {boolean} props.isDialogVisible - Whether the dialog is visible or not.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setIsDialogVisible - The function to set the visibility of the dialog.
 * @return {JSX.Element | null} The modal dialog component or null if not visible.
 */
const ModalDialogOkCancel = ({ message, onOK, onCancel, type, isDialogVisible, setIsDialogVisible }: Props) => {


    const handleOK = () => {
        setIsDialogVisible(false);
        onOK && onOK();
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
