import { __Client_FirebaseStorageDomain } from '../../share/consts';
import { isNull_Undefined_emptyString } from '../../utils/stringManipulation';
import styles from './Card.module.css'; // Importing the CSS module
import svg from '../../assets/images/real-estate.svg';
import { Link } from 'react-router-dom';
import { IListingFields } from '../../share/types/listings';
import { isURL_ImageFileExtension } from '../../share/firebase/storage/imageStorageManager';
type Props = {
    // name: string;
    // description: string;
    // imageUrl: Array<string>;
    // _id: string;
    item: IListingFields
    deleteListing: (item: IListingFields) => void
}

// const Card = ({ name, description, imageUrl, _id = '', deleteListing }: Props) => {
const Card = ({ item, deleteListing }: Props) => {
    // console.log('item:', item)
    const { name, description, imageUrl, _id } = item

    if (isNull_Undefined_emptyString(_id))
        throw new Error("id is null or undefined. n:sad9jja-ssa3-e");


    // Regular expression to match common image file extensions
    // const regex = /\.(jpg|jpeg|png|gif|bmp|svg)$/i;

    const imageSrc = imageUrl.length > 0 && isURL_ImageFileExtension(imageUrl[0]) ? (__Client_FirebaseStorageDomain + imageUrl[0]) : svg;


    return (
        <div className={styles.card} key={_id} >
            <Link to={`/listing-view/${_id}`} state={{ singleListing: item }}>
                <img src={imageSrc} alt="Card Image" />
            </Link>
            <div className={styles['card-content']}>
                <h3>{name}</h3>
                <p>{description}</p>
                <div className={styles["btn-wrap"]}>
                    <Link to={`/listings-edit/${_id}`} state={{ singleListing: item }} className={styles.btn}>Edit</Link>
                    <Link to='#' onClick={() => deleteListing(item)} className={styles.btn}>Delete</Link>

                </div>
            </div>
        </div>
    );
}

export default Card;
