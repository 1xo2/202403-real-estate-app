
import { FaRegUserCircle } from 'react-icons/fa';
import { IUser } from '../redux/user/userSlice';

type props = {
    user: IUser | null | undefined
}

export default function Avatar({ user }: props) {
    const style = 'rounded-full w-7 h-7 object-cover'
    return (
        <div>
            {user?.userPhoto ? (
                <img className={style} src={user?.userPhoto} alt="avatar" />
            ) : (
                <FaRegUserCircle className={style} />)}
        </div>
    )
}