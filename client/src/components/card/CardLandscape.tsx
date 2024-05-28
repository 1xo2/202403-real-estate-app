import { FaDeleteLeft } from 'react-icons/fa6';
import styles from './CardLandscape.module.css'; // Importing the CSS module    

type Props = {
    index: number,
    file?: File,
    fileUrl?: string
    totalImages: number
    firstCover?: boolean
    header?: string
    body?: JSX.Element    
}

export default function CardLandscape({ file, fileUrl, index, totalImages, firstCover, header, body }: Props) {

    // if (!file && !fileUrl) {
    //     toast.error('internal error nu: fileurlfile');
    //     throw new Error("CardLandscape | file and fileUrl are both undefined nu: fileurlfile");
    // }


    return (
        <div key={(file && file.name || 'x') + index} className={styles['landscapeCard']}>
            <div className={styles['lc-leftSide']}>
                <span >{index + 1} / {totalImages}</span>
                <img src={file ? URL.createObjectURL(file) : fileUrl} className='object-cover rounded-sm' alt='listing image' />
            </div>
            <div className={styles['lc-rightSide']}>
                <div className={styles['lc-header']}>{firstCover && index == 0 ? 'The Cover Image' : header && header}  </div>
                <div className={styles['lc-body']}>
                    {body && body}
                </div>
                <div className={styles['lc-crl']}>
                    <FaDeleteLeft aria-label={'btnRemoveSelectedFile_' + index.toString()} title='Remove' className='cursor-pointer hover:text-red-500 text-2xl ' />
                </div>
            </div>
        </div>
    )
}