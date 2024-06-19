
import { FaRegUserCircle } from 'react-icons/fa';
import { IUser } from '../redux/user/userSlice';
import { get_localStorage } from '../utils/localStorageManager';

type props = {
    user: IUser | null | undefined;
    cssClass?: string;
    onClick?: () => void;
}

export default function Avatar({ user, cssClass, onClick }: props) {


    const userLocalImage = user?._id && get_localStorage({ _id: user?._id, key: 'Avatar' });
    const userImage = userLocalImage || user?.userPhoto;
    const style = cssClass || 'rounded-full w-7 h-7 object-cover'



    return userImage ? (
        <img className={style} src={userImage} alt="avatar" onClick={onClick} />
    ) : (
        <FaRegUserCircle className={style} onClick={onClick} />
    );
    // return <img style={{ width: '2rem' }} src="https://lh3.googleusercontent.com/a/ACg8ocLkzlDHeo-03Ix4_leXK9_IJQ08tLJGpfJJcQy8E4vnu775pQ=s96-c" alt="xxx" />
}