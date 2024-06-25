import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/card/Card'
import SwiperNav from '../../components/swiper/SwiperNav'
import { apiManager } from '../../share/apiManager'
import { IListingFields } from '../../share/types/listings'
import { get_localStorage, update_localStorage } from '../../utils/localStorageManager'
import styles from './HomePage.module.css'
const _id = 'homePage'
type TApiRes = {
  forSale: IListingFields[]
  forRent: IListingFields[]
  forOffer: IListingFields[]
}
const _sListingsArr = ['Sale', 'Rent', 'Offer']

const Listings = (data: IListingFields[], groupName: string) => (
  <>
    {
      data && data.length > 0
        ?
        (<div>
          <h2>{`Currently On ${groupName}:`} </h2>
          <div>
            {
              data.map((item, index) => {
                return <Card key={index} item={item} link={`/search?${groupName.toLowerCase()}=true`} />                
              })
            }
          </div>
        </div>
        ) : (<h2>{`Nothing for ${groupName} at the moment`}</h2>)
    }
  </>
);


const Header = () => (
  <div className={styles.header}>
    <h1>Find your next <span>perfect</span>  <br />
      place with ease.
    </h1>
    <div className={styles.headerCap}>
      X Estate is the best best place to find your next perfect place to live.
      <br />
      We have a large wrang of properties for you to choose from.
      <br />
      <Link className={styles.headerLink} to={'/search'}>Lets Get Started..</Link>
    </div>
  </div>
);


export default function HomePage() {


  const [listingData, setListingData] = useState<TApiRes>()

  const fetchData = async () => {

    try {
      
      const {data} = await apiManager({
        httpMethod: 'get',
        urlPath: `/api/public/homePage`,
      });
      

      if (!data) {
        // todo: branding static data fallback
        return
      }

      setListingData(data)

      setTimeout(() => {
        update_localStorage({ _id, key: 'homePage', isArray: false, value: data });
      }, 0);


    } catch (error) {
      console.log('error:', error)

    }
  }


  // data Api/LocalStorage
  useEffect(() => {

    try {
      if (!listingData) {
        const sData = get_localStorage({ _id, key: 'homePage' })
        if (sData) {
          console.log('from cache')
          setListingData(JSON.parse(sData))
        } else {
          console.log('from Api')
          fetchData()
        }
      }

    } catch (error) {
      console.log('api error:', error)

    }

  }, [])

  const getImgUrls = (): string[] => {

    if (!listingData) return [''];

    return [
      listingData.forSale && listingData.forSale.length > 0 ? listingData.forSale[0].imageUrl[0] : '',
      listingData.forRent && listingData.forRent.length > 0 ? listingData.forRent[0].imageUrl[0] : '',
      listingData.forOffer && listingData.forOffer.length > 0 ? listingData.forOffer[0].imageUrl[0] : '',
    ].filter(Boolean);
  };

  return (
    <div>

      <Header />

      {/* SLIDER */}
      {listingData &&
        <SwiperNav urlArr={getImgUrls()} txtArr={_sListingsArr} />
      }

      {/* 3 listings Arr */}
      {listingData &&
        <div className={styles.listingBox}>
          {/* FOR SALE */}
          {Listings(listingData.forSale, _sListingsArr[0])}
          {/* FOR RENT */}
          {Listings(listingData.forRent, _sListingsArr[1])}
          {/* FOR OFFER */}
          {Listings(listingData.forOffer, _sListingsArr[2])}
        </div>
      }
    </div>




  )
}