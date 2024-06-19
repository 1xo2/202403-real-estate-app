import { Link } from 'react-router-dom';
import svg from '../../assets/images/real-estate.svg';
import { __Client_FirebaseStorageDomain } from '../../share/consts';
import { isURL_ImageFileExtension } from '../../share/firebase/storage/imageStorageManager';
import { IListingFields } from '../../share/types/listings';
import { isNull_Undefined_emptyString } from '../../utils/stringManipulation';
import styles from './Card.module.css'; // Importing the CSS module
import ListingDetailView from '../listing/ListingDetailView';
type Props = {
    item: IListingFields
    deleteListing?: (item: IListingFields) => void;
    link?: string
}

const Card = ({ item, deleteListing, link }: Props) => {
    // console.log('item:', item)
    const { imageUrl, _id } = item

    if (isNull_Undefined_emptyString(_id)) {
        console.error("Card: id is null or undefined. n:sad9jja-ssa3-e")
        return;
        // throw new Error("Card: id is null or undefined. n:sad9jja-ssa3-e");
    }


    const imageSrc = imageUrl.length > 0 && isURL_ImageFileExtension(imageUrl[0]) ? (__Client_FirebaseStorageDomain + imageUrl[0]) : svg;


    return (
        <div className={styles.card} key={_id} data-cy='cy-card'>
            <Link to={link || `/listing-view/${_id}`} state={{ singleListing: item }}>
                <img src={imageSrc} alt="Card Image" />
            </Link>
            <div className={styles['card-content']}>
                <ListingDetailView formData={item} isMin />
                {deleteListing &&
                    <div className={styles["btn-wrap"]}>
                        <Link to={`/listings-edit/${_id}`} state={{ singleListing: item }} className={styles.btn}>Edit</Link>
                        <Link to='#' onClick={() => deleteListing(item)} className={styles.btn}>Delete</Link>
                    </div>}
            </div>
        </div>
    );
}

export default Card;
