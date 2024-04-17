
import { FaRegUserCircle } from 'react-icons/fa';
import { IUser } from '../redux/user/userSlice';
import { __Client_AvatarLocalStorage } from '../share/consts';
import { User } from 'firebase/auth';

type props = {
    user: IUser | null | undefined,
    cssClass?: string
}

export default function Avatar({ user, cssClass }: props) {
    let userLocalImage;
    if (user && !user.userPhoto) {
        // avatar get from OAUth or localStorage - not db
        // user case: staid login, refresh/rerender or... and out of internet data
        const userLocal: User = JSON.parse(localStorage.getItem(__Client_AvatarLocalStorage) || '{}')
        if (user.eMail === userLocal?.email) {
            userLocalImage = userLocal?.photoURL || '';
        }
    }
    const userImage = user?.userPhoto || userLocalImage;
    const style = cssClass || 'rounded-full w-7 h-7 object-cover'

    
    return userImage ? (
        <img className={style} src={userImage} alt="avatar" />
    ) : (
        <FaRegUserCircle className={style} />
    );
}