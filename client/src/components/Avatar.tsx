
import { FaRegUserCircle } from 'react-icons/fa';
import { IUser } from '../redux/user/userSlice';
import { getAvatar_localStorage } from '../utils/localStorageManager';

type props = {
    user: IUser | null | undefined;
    cssClass?: string;
    onClick?: () => void;
}

export default function Avatar({ user, cssClass, onClick }: props) {
    // let userLocalImage;
    // if (user && !user.userPhoto) {
    //     // avatar get from OAUth or localStorage - not db
    //     // user case: staid login, refresh/rerender or... and out of internet data
    //     // const userLocal: User = JSON.parse(localStorage.getItem(__Client_AvatarLocalStorage) || '{}')
    //     // if (user.eMail === userLocal?.email) {
    //     //     userLocalImage = userLocal?.photoURL || '';
    //     // }        
    // }

    const userLocalImage = getAvatar_localStorage(user?._id)
    const userImage = userLocalImage || user?.userPhoto ;
    const style = cssClass || 'rounded-full w-7 h-7 object-cover'

    
    return userImage ? (
        <img className={style} src={userImage} alt="avatar" onClick={onClick}/>
    ) : (
            <FaRegUserCircle className={style} onClick={onClick} />
    );
}