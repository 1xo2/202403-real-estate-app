////////////
//  portal rendering
////////////
import { useState } from 'react';
import "../ModalDialogOkCancel.css";
import ModalDialog_PortalRendering_OkCancel, { IModalDialog_PortalRendering_OkCancel } from './ModalDialog_PortalRendering_OkCancel';

export interface IModalOkCancel extends IModalDialog_PortalRendering_OkCancel {    
    isDialogVisible: boolean,    
}



// eslint-disable-next-line react-refresh/only-export-components
export default function ModalOkCancel  ({ message, onOK, onCancel, type, isDialogVisible }: IModalOkCancel)  {
    const [isOpen, setIsOpen] = useState(isDialogVisible);
    console.log('ModalOkCancel - isOpen:', isOpen)

    const handleClose = () => {
        setIsOpen(false);
        onCancel && onCancel();
    };

    return (
        <ModalDialog_PortalRendering_OkCancel
            message={message}
            isOpen={isOpen}
            onOK={onOK}
            type={type}
            onClose={handleClose}
            onCancel={onCancel}
        />
    );
}


// export const modalOkCancel = ({ message, onOK, onCancel, type, isDialogVisible }: IModalOkCancel) => {
//     return <ModalOkCancel
//         message={message}
//         onOK={onOK}
//         onCancel={onCancel}
//         type={type}
//         isDialogVisible={isDialogVisible}
//     />;
// };





// export default function ModalOkCancel({}: Props) {
//   return (
//     <div>ModalOkCancel</div>
//   )
// }