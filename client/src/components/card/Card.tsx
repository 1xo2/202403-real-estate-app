import { __Client_FirebaseStorageDomain } from '../../share/consts';
import { isNull_Undefined_emptyString } from '../../utils/stringManipulation';
import styles from './Card.module.css'; // Importing the CSS module
import svg from '../../assets/images/real-estate.svg';
import { Link } from 'react-router-dom';
type Props = {
    name: string;
    description: string;
    imageUrl: Array<string>;
    _id: string;
    deleteListing: (id: string) => void
}

const Card = ({ name, description, imageUrl, _id = '', deleteListing }: Props) => {

    if (isNull_Undefined_emptyString(_id))
        throw new Error("id is null or undefined. n:sad9jja-ssa3");


    // Regular expression to match common image file extensions
    // const regex = /\.(jpg|jpeg|png|gif|bmp|svg)$/i;


    // Check if imageUrl exists and is not an empty array
    const imageSrc = imageUrl.length > 0 && ((/\.(jpg|jpeg|png|gif|bmp|svg)$/i).test(imageUrl[0])) ? __Client_FirebaseStorageDomain + imageUrl[0] : svg;
    console.log('imageSrc:', imageSrc)

    return (
        <div className={styles.card} key={_id} >
            <img src={imageSrc} alt="Card Image" />
            <div className={styles['card-content']}>
                <h3>{name}</h3>
                <p>{description}</p>
                <div className={styles["btn-wrap"]}>
                    <Link to={`/listing/${_id}`} className={styles.btn}>Edit</Link>
                    <Link to='#' onClick={() => deleteListing(_id)} className={styles.btn}>Delete</Link>

                </div>
            </div>
        </div>
    );
}

export default Card;
