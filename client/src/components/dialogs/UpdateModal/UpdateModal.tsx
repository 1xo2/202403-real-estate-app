
import Spinner from '../Spinner';
import './UpdateModal.css';

type UpdateModalProps = {
    isOpen: boolean;
};


export default function UpdateModal({ isOpen }: UpdateModalProps) {


    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>Updating...</h2>
                </div>
                <div className="modal-body">
                    <Spinner />
                </div>
            </div>
        </div>
    );
}

