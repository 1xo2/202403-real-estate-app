
// Import Swiper React components
import { Autoplay, Keyboard, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import styles2 from './SwiperNav.module.css'
import { __Client_FirebaseStorageDomain } from '../../share/consts';

type Props = { urlArr: string[]; txtArr?: string[]; }

export default function SwiperNav({ urlArr, txtArr }: Props) {
    return (
        <>
            {/* https://swiperjs.com/demos */}
            <Swiper
                autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                }}
                spaceBetween={30}
                
                slidesPerView={1.2}
                // centeredSlides={true}
                centeredSlides={false}
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
                modules={[Autoplay, Keyboard, Scrollbar, Navigation, Pagination]}
                className={styles2.swiper}
            >
                {
                    urlArr.map((url, index) => (
                        <SwiperSlide key={url} className={styles2.swiperSlide} >
                            {txtArr &&
                                <div className={styles2.swiperTxt} >{txtArr[index]}</div>}

                            <img src={__Client_FirebaseStorageDomain + url} alt="Listing Image"
                                className="h-[24rem] w-full"
                            />



                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </>
    )
}