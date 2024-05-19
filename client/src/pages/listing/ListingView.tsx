import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { fetchHeaders } from "../../share/fetchHeaders";
import { IListingFields } from "../../share/types/listings";
import { loader } from "../../components/dialogs/Loader";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";


// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard, Scrollbar, Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


import styles from './ListingView.module.css';
import { __Client_FirebaseStorageDomain } from "../../share/consts";


type Props = {}

export default function ListingView({ }: Props) {

    // SwiperCore.use([Navigation]);
    // const [swiper, setSwiper] = useState<Swiper | null>(null)


    // init Swiper:


    const dispatch: AppDispatch = useDispatch();
    const { state } = useLocation()
    const singleListing: IListingFields = state?.singleListing;

    const { listingId } = useParams()

    const [formData, setFormData] = useState<IListingFields>(singleListing || null);

    useEffect(() => {
        loader(async () => {
            // Link state else id for API
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

                            if (res.status === 200) {
                                const data = await res.json();
                                console.log('useEffect data:', data)
                                setFormData(() => {
                                    // console.log('useEffect prev:', prev)
                                    return data
                                });

                            }
                        } catch (error) {
                            console.error('error:', error);
                        }
                    };

                    fetchData();
                }
            }
        }, dispatch)
    }, [listingId]);


    return (
        <div className="h-full" >
            {formData && formData.imageUrl && formData.imageUrl.length > 0 && (
                // https://swiperjs.com/demos
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
                    className={styles.swiper}
                >
                    {
                        formData.imageUrl.map((url) => (
                            <SwiperSlide key={url} className={styles.swiperSlide} >

                                <img src={__Client_FirebaseStorageDomain + url} alt="Listing Image" 
                                    className="h-[550px] w-full "  
                                    />
                                    
                                {/* <div style={{ background: `url(${__Client_FirebaseStorageDomain + url}) center no-repeat`, backgroundSize: 'cover' }} 
                                     className="h-[40%] bg-blue-500"> 
                               {url}     
                                </div> */}
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            )}

        </div>
    )
}