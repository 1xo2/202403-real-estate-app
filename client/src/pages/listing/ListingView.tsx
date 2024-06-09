import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { loader } from "../../components/dialogs/Loader";
import { AppDispatch, RootState } from "../../redux/store";
import { fetchHeaders } from "../../share/fetchHeaders";
import { IListingFields } from "../../share/types/listings";


// Import Swiper React components
import { Keyboard, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';


// import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking } from "react-icons/fa";
import { toast } from "react-toastify";
import PageContainer from "../../components/PageContainer";
import { __Client_FirebaseStorageDomain } from "../../share/consts";
import { toastBody } from "../../share/toast";
import styles2 from './ListingView.module.css';
import { CheckmarkIcon } from "../../components/svg/CheckmarkIcon";
import ListingDetailView from "../../components/listing/ListingDetailView";







export default function ListingView() {
    interface IListingView extends IListingFields {
        eMail?: string
    }

    const { currentUser } = useSelector((state: RootState) => state.user);
    const dispatch: AppDispatch = useDispatch();
    const { state } = useLocation()
    const singleListing: IListingFields = state?.singleListing;
    const { listingId } = useParams()

    const [formData, setFormData] = useState<IListingView>(singleListing || null);
    const [errorMsg, setErrorMsg] = useState('');
    // const [contact, setContact] = useState(false)
    // const [exposeEmail, setExposeEmail] = useState(false)
    const fetchData = async () => {

        loader(async () => {
            // Link state else id for API
            console.log('data from caching singleListing:', singleListing)
            if (singleListing) {
                // console.log('cache:  singleListing:', singleListing)
                setFormData(() => {
                    // console.log('useEffect prev:', prev)
                    return singleListing
                });
                console.log('cache:  singleListing formData:', formData)
            } else {

                if (listingId) {
                    console.log('API with listingId:')
                    const fetchData = async () => {
                        try {
                            const res = await fetch('/api/listing/get/' + listingId, {
                                method: "get",
                                headers: fetchHeaders
                            });
                            const data = await res.json();

                            if (res.status === 200) {
                                console.log('useEffect data:', data)
                                setFormData(() => {
                                    // console.log('useEffect prev:', prev)
                                    return data
                                });
                            } else {
                                if (data.message) {
                                    toast.error(data.message || 'Internal Server Error', toastBody);
                                    setErrorMsg(data.message)
                                }

                                console.log('res:', res)
                            }
                        } catch (error) {
                            console.error('error:', error);
                        }
                    };

                    fetchData();
                }
            }
        }, dispatch)
    }
    useEffect(() => {
        if (!formData) fetchData()
    }, [listingId]);


    const getLandLordEmail = async () => {

        loader(async () => {

            const res = await fetch('/api/user/' + formData.FK_User, {
                method: "get",
                headers: fetchHeaders
            });
            const data = await res.json()// as IUser | null;

            if (res.status === 200) {
                console.log('useEffect data:', data)
                if (data.eMail) setFormData((prev) => ({ ...prev, eMail: data.eMail }));

            } else {
                if (data.message) {
                    toast.error(data.message || 'Internal Server Error', toastBody);
                    setErrorMsg(data.message)
                }

                console.log('res:', res)
            }
        }, dispatch)
    }

    return (
        <div className="h-full" >
            {formData && formData.imageUrl && formData.imageUrl.length > 0 ? (
                <>

                    {/* https://swiperjs.com/demos */}
                    <Swiper
                        slidesPerView={1}
                        centeredSlides={true}
                        // centeredSlides={false}
                        slidesPerGroupSkip={1}
                        grabCursor={true}
                        keyboard={{
                            enabled: true,
                        }}
                        // breakpoints={{
                        //     769: {
                        //         slidesPerView: 2,
                        //         slidesPerGroup: 2,
                        //     },
                        // }}
                        scrollbar={true}
                        navigation={true}
                        pagination={{
                            clickable: true,
                        }}
                        modules={[Keyboard, Scrollbar, Navigation, Pagination]}
                        className={styles2.swiper}
                    >
                        {
                            formData.imageUrl.map((url) => (
                                <SwiperSlide key={url} className={styles2.swiperSlide} >

                                    <img src={__Client_FirebaseStorageDomain + url} alt="Listing Image"
                                        className="h-[24rem] w-full"
                                    />

                                    {/* <div style={{ background: `url(${__Client_FirebaseStorageDomain + url}) center no-repeat`, backgroundSize: 'cover' }} 
                                     className="h-[40%] bg-blue-500"> 
                               {url}     
                                </div> */}
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>

                    <PageContainer isWide={true} >
                        <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-3'>
                            <h1 className={styles2.ttl} >{formData.name}</h1>

                            {/* <p className='text-2xl font-semibold capitalize'>
                                {formData.name} - ${' '}
                                {formData.offer
                                    ? formData.priceDiscounted?.toLocaleString('en-US')
                                    : formData.price.toLocaleString('en-US')}
                                {formData.type === 'rent' && ' / month'}
                            </p>
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
                            <ul className={`${styles2.ulInfo} text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6`}>
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
                            </ul> */}
                            <ListingDetailView formData={formData} />

                        </div>

                        {formData.eMail && <p className="pb-4 pr-7 float-right " >Landlord eMail:
                            <span className="font-semibold" > {formData.eMail}</span></p>}

                        {(currentUser?._id !== formData.FK_User!!) &&
                            <button disabled={!!formData.eMail} type="button" className="btnBig mb-10 bg-slate-600 w-full relative" onClick={getLandLordEmail} >
                                revile landlord eMail
                                {formData.eMail && <span className={"btnIco"}>
                                    <CheckmarkIcon />
                                </span>}
                            </button>}


                    </PageContainer>

                </>
            ) : (
                errorMsg ?
                    <p className={styles2.errMsg} >{errorMsg}</p> :
                    <h1>Loading...</h1>
            )}

        </div>
    )
}