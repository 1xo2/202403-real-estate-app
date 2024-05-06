////////////
//  portal rendering
////////////
import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { AiOutlineExclamationCircle, AiOutlineInfoCircle } from 'react-icons/ai';
import { CgDanger } from 'react-icons/cg';
import "../ModalDialogOkCancel.css";

export interface IModalDialog_PortalRendering_OkCancel {
    message?: string;
    onOK?: () => void;
    onCancel?: () => void;
    type?: "info" | "danger" | "alert";
    isOpen?: boolean; // Add isOpen prop
    onClose?: () => void; // Add onClose prop
}

const ModalDialog_PortalRendering_OkCancel = ({ message, onOK, onCancel, type, isOpen }: IModalDialog_PortalRendering_OkCancel) => {
    console.log('ModalDialog_PortalRendering_OkCancel -- isOpen:', isOpen)

    const modalRoot = document.getElementById('modal-root')!;
    const el = useRef<HTMLDivElement>(document.createElement('div'));

    useEffect(() => {
        console.log('ModalDialog_PortalRendering_OkCancel 2 -- isOpen:', isOpen)
        const modalElement = el.current;
        modalRoot.appendChild(modalElement);

        return () => {
            modalRoot.removeChild(modalElement);
        };
    }, [el, modalRoot, isOpen]);

    const handleOK = () => {        
        onOK &&onOK();
    };

    const handleCancel = () => {        
        onCancel && onCancel();
    };

    if (!isOpen) {
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

    return ReactDOM.createPortal(
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
        </div>,
        
        el.current
    );
};

export default ModalDialog_PortalRendering_OkCancel;
