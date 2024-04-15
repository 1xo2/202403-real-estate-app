
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { FaRegUserCircle } from "react-icons/fa";


export default function Avatar() {
    const { currentUser } = useSelector((state: RootState) => state.user);
    console.log('currentUser?.userPhoto:', currentUser?.userPhoto)
    return (
        <div>
            {/* {
                currentUser?.userPhoto ? (<img src={currentUser?.userPhoto} alt="avatar" />) :
                    (<FaRegUserCircle />)
            } */}
        </div>
    )
}