import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking } from "react-icons/fa"
import { IListingFields } from "../../share/types/listings"
import styles2 from './ListingDetailView.module.css'

type Props = {
    formData: IListingFields;
    isMin?: boolean;
}

export default function ListingDetailView({ formData, isMin = false }: Props) {
    return (
        <div>
            <p className={`text-2xl font-semibold capitalize ${styles2.txt3dot}`}>
                {formData.name} - ${' '}
                {formData.offer
                    ? formData.priceDiscounted?.toLocaleString('en-US')
                    : formData.price.toLocaleString('en-US')}
                {formData.type === 'rent' && ' / month'}
            </p>


            {!isMin &&
                <div className={styles2.min} >
                    <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
                        <FaMapMarkerAlt className='text-green-700' />
                        {formData.address}
                    </p>
                    <div className='flex gap-4'>
                        <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                            {formData.type === 'rent' ? 'For Rent' : 'For Sale'}
                        </p>
                        {formData.offer && (
                            <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                ${+formData.price - +(formData.priceDiscounted || 0)} OFF
                            </p>
                        )}
                    </div>

                    <p className='text-slate-800'>
                        <span className='font-semibold text-black'>Description - </span>
                        {formData.description}
                    </p>
                </div>
            }


            <ul className={`${styles2.ulInfo} text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6 ${isMin ? '!gap-1' : ''}`}>
                <li>
                    <FaBed className='text-lg' />
                    {formData.bedrooms > 1
                        ? `${formData.bedrooms} beds `
                        : `${formData.bedrooms} bed `}
                </li>
                <li>
                    <FaBath className='text-lg' />
                    {formData.bathrooms > 1
                        ? `${formData.bathrooms} baths `
                        : `${formData.bathrooms} bath `}
                </li>
                <li>
                    <FaParking className='text-lg' />
                    {formData.parking ? 'Parking spot' : 'No Parking'}
                </li>
                <li>
                    <FaChair className='text-lg' />
                    {formData.furnished ? 'Furnished' : 'Unfurnished'}
                </li>
            </ul>
        </div>
    )
}