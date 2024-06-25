import { useEffect, useRef, useState } from 'react';
import { ImSpinner2 } from "react-icons/im";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import xss from 'xss';
import Card from '../../components/card/Card';
import { loader } from '../../components/dialogs/Loader';
import UpdateModal from '../../components/dialogs/UpdateModal/UpdateModal';
import { AppDispatch, RootState } from '../../redux/store';
import { IListingFields } from '../../share/types/listings';
import styles from './SearchPage.module.css';
import debounce from 'lodash.debounce';


type TDataForm = {
    rent?: boolean;
    sale?: boolean;
    type: 'rent' | 'sale' | null;
    sort: string;
    order: string;
    searchTerm?: string | null;
    totalResults?: number | null;
    pageNo?: number | null;
} & Omit<IListingFields, 'type' | 'name' | 'description' | 'address' | 'price' | 'priceDiscounted' | 'FK_User' | 'imageUrl' | 'bedrooms' | "bathrooms">;

const _formDataIni: TDataForm = {
    searchTerm: '',
    type: null,
    rent: false,
    sale: false,
    offer: false,
    furnished: false,
    parking: false,
    order: 'ascending',
    sort: 'createdAt',
    totalResults: null,
    pageNo: null
}

type TResponseApi = {
    listingsPage: IListingFields[];
    pageNo: number;
    totalResults: number;
}

type TPage = {} & Omit<TResponseApi, 'totalResults'>

type TPagination = {
    listingsPageArr: TPage[];
    totalResults: number;
}
type TFlags = {
    isFetching_Debounce: boolean;
    isNewSearch: boolean; // for auto search on scroll event conditions true    
}
const _pageLimit = 9;

export default function SearchPage() {
    const dispatch: AppDispatch = useDispatch();
    const { loading } = useSelector((state: RootState) => state.user);
    const navigate = useNavigate()



    const [formData, setFormData] = useState<TDataForm>(_formDataIni as TDataForm)                  // form search info
    const formDataRef = useRef<TDataForm>(_formDataIni as TDataForm)                                // form search info
    const [resultsPagination, setResultsPagination] = useState<TPagination>({} as TPagination)      // api results

    const sideRightRef = useRef<HTMLDivElement>(null);  // paging by scroll
    const [isNextPage, setIsNextPage] = useState(false) // msg loading



    const flagsIni: TFlags = {
        isFetching_Debounce: false,
        isNewSearch: false,
    }
    const flags_ref = useRef(flagsIni)


    // PAGING
    useEffect(() => {
        const handleScroll = debounce(async () => {

            if (!flags_ref.current.isNewSearch) {
                return // not new search
            }
            if ((formDataRef.current.pageNo && formDataRef.current.totalResults) && (formDataRef.current.pageNo * _pageLimit) >= formDataRef.current.totalResults) {
                return // paging end
            }

            if (sideRightRef.current && !flags_ref.current.isFetching_Debounce) {
                const { scrollTop, scrollHeight, clientHeight } = sideRightRef.current;

                if (scrollTop + clientHeight >= scrollHeight * 0.999) {
                    try {
                        flags_ref.current.isFetching_Debounce = true
                        console.log('Scrolled to 99%');

                        setIsNextPage(true); // msg loading
                        await new Promise(resolve => setTimeout(async () => {

                            await searchClick_eh();
                            setIsNextPage(false); // msg loading
                            flags_ref.current.isFetching_Debounce = false;

                            resolve;
                        }, 1000));



                    } catch (error) {
                        console.log('error:', error)

                    }
                }
            }
        }, 200);

        const sideRightElement = sideRightRef.current;
        if (sideRightElement) {
            sideRightElement.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (sideRightElement) {
                sideRightElement.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);
    // URL params 
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);

        // Loop through form data keys and set state based on URL params
        (Object.keys(_formDataIni) as (keyof TDataForm)[]).forEach(key => {
            const sValue = urlParams.get(key);
            if (sValue !== undefined && sValue !== null && sValue !== '') {
                // !the xss is string type
                let value: any = (sValue !== undefined && sValue !== null && sValue !== '') ? xss(String(sValue)) : _formDataIni[key];

                if (typeof _formDataIni[key] === 'boolean') {
                    value = value === 'true';
                }

                formDataRef.current = { ...formDataRef.current, [key]: value };
            }
        });

        setFormData(prevState => ({
            ...prevState,
            ...formDataRef.current
        }));

    }, [location.search])


    // Handle form field changes - event babel.
    function fields_eh_Babel(e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.ChangeEvent<HTMLInputElement>): void {
        const target = e.target as HTMLInputElement

        let value: boolean | string;
        const key = target.id.split('-')[1] as keyof TDataForm;

        if (target) {
            if (target.type === 'checkbox') {
                value = target.checked
            }

            if (target.type === 'select-one') {
                value = target.value
            }

            if (target.type === 'text') {
                value = xss(target.value || '')
            }


            flags_ref.current.isNewSearch = false

            setFormData(prevState => {
                const state = { ...prevState, [key]: value }
                formDataRef.current = { ...formDataRef.current, [key]: value };  // update ref here: value is async value change of closure/state

                // form reset
                flags_ref.current = { ...flagsIni };
                setResultsPagination({} as TPagination);
                formDataRef.current.pageNo = _formDataIni.pageNo;
                formDataRef.current.totalResults = _formDataIni.totalResults;
                state.pageNo = _formDataIni.pageNo; // update also the state: to avoid race conditions or stale state issues.
                state.totalResults = _formDataIni.totalResults;

                const urlParams = getUrlParamsFromObject(formDataRef.current as TDataForm)
                navigate(`/search?${urlParams}`)

                return state;
            })
        }

    }

    const getUrlParamsFromObject = (data: TDataForm) => {

        const urlParams = new URLSearchParams()
        Object.keys(data).forEach(key => {
            const value = data[key as keyof typeof formData];
            if (value !== null && value !== undefined && value !== false && value !== '') {
                if (value !== 'ascending' && value !== 'createdAt') { // api default value
                    urlParams.set(key, String(value))
                }
            }
        })
        return urlParams.toString()
    }

    // Handle search button click
    async function searchClick_eh(): Promise<void> {
        loader(async () => {

            const { rent, sale, ...data } = formDataRef.current
            if (rent === sale) {
                data.type = null;
                // delete data.type;
            } else {
                data.type = sale ? 'sale' : 'rent';
            }

            const urlParams = new URLSearchParams(location.search);
            const pageNo = urlParams.get('pageNo') // for stael closer between 
            const totalResults = urlParams.get('totalResults') // for stael closer between 

            if (totalResults && parseInt(pageNo || '0') * _pageLimit >= parseInt(totalResults || '0')) {
                console.log('No more data to fetch')
                return
            }

            //          data.pageNo = (parseInt(pageNo || data.pageNo as string) + 1).toString()
            data.pageNo = ((pageNo && parseInt(pageNo)) || data.pageNo || 0) + 1
            data.totalResults = totalResults ? parseInt(totalResults) : null


            const params = getUrlParamsFromObject(data)



            const url = `/api/public/search?${params}`;
            const res = await fetch(url, {
                method: 'get',
                headers: fetchHeaders,
            })
            if (!res.ok) {
                throw new Error('Failed to fetch data');
            }

            const results: TResponseApi = await res.json()
            console.log('api results:', results)

            
            const page: TPage = {
                listingsPage: results.listingsPage,
                pageNo: results.pageNo
            }
            setResultsPagination(prevState => {
                return {
                    ...prevState,
                    listingsPageArr: [...(prevState.listingsPageArr || []), page],
                    totalResults: results.totalResults,

                }
            })



            formDataRef.current.pageNo = results.pageNo;
            formDataRef.current.totalResults = results.totalResults;

            setFormData(prevState => {
                return {
                    ...prevState,
                    totalResults: results.totalResults,
                    pageNo: results.pageNo || 1
                }
            })
            




            const searchQuery = getUrlParamsFromObject({
                ...formDataRef.current,
                totalResults: results.totalResults,
                pageNo: results.pageNo
            })

            flags_ref.current.isNewSearch = true;
            navigate(`/search?${searchQuery}`)


        }, dispatch)
    }

    return (
        <div className={styles.parentContainer}>
            <div className={styles.sideLeft} onChange={fields_eh_Babel}>
                <input type="text" placeholder="Search" id='txt-searchTerm' value={formData.searchTerm || ''} />
                <div>
                    {/* TYPES */}
                    <fieldset>
                        <legend>Type</legend>

                        <div className={styles.ctrlBox} >
                            <input checked={!!formData.rent} type="checkbox" id="chb-rent" title="Rent" />
                            <label htmlFor="chb-rent">Rent</label>
                        </div>
                        <div className={styles.ctrlBox} >
                            <input checked={!!formData.sale} type="checkbox" id="chb-sale" title="Sale" />
                            <label htmlFor="chb-sale">Sale</label>
                        </div>
                        <div className={styles.ctrlBox} >
                            <input checked={!!formData.offer} type="checkbox" id="chb-offer" title="Offer" />
                            <label htmlFor="chb-offer">Offer</label>
                        </div>
                    </fieldset>

                    {/* AMENITIES */}
                    <fieldset>
                        <legend>Amenities</legend>

                        <div className={styles.ctrlBox} >
                            <input checked={!!formData.parking} type="checkbox" id="chb-parking" title="Parking" />
                            <label htmlFor="chb-parking">Parking</label>
                        </div>
                        <div className={styles.ctrlBox} >
                            <input checked={!!formData.furnished} type="checkbox" id="chb-furnished" title="Furnished" />
                            <label htmlFor="chb-furnished">Furnished</label>
                        </div>
                    </fieldset>

                    {/* ORDER */}
                    <fieldset>
                        <legend>Order</legend>

                        <div className={`${styles.ctrlBox} ${styles.ctrlBoxSelect}`} >
                            <label htmlFor="lb-sort">Sort-by:</label>
                            <select id='lb-sort' title='Sort' value={formData.sort || ''}>
                                <option value="createdAt">Date</option>
                                <option value="price">Price</option>
                                <option value="bedRooms">Bed Rooms</option>
                                <option value="bathrooms">Bath Rooms</option>
                            </select>
                        </div>

                        <div className={`${styles.ctrlBox} ${styles.ctrlBoxSelect}`} >
                            <label htmlFor="lb-orderBy">Order-by:</label>
                            <select id='lb-order' title='orderBy' value={formData.order || ''} >
                                <option value="ascending">Ascending</option>
                                <option value="descending">Descending</option>
                            </select>
                        </div>

                    </fieldset>
                </div>
                <hr />
                <button onClick={searchClick_eh} type="button" className='btnBig bg-slate-600' >Search</button>
            </div>

            <div ref={sideRightRef} className={styles.sideRight} >

                {/* Use the Search Button */}
                {!resultsPagination?.totalResults && <h1>Results: <span className='italic text-base opacity-80 ' >'Use the Search Button'</span></h1>}
                {/* RESULTS */}
                {
                    resultsPagination && resultsPagination.listingsPageArr && resultsPagination.listingsPageArr.map((page: TPage, index: number) => (
                        <div key={page.pageNo} >
                            <h3>
                                {
                                    resultsPagination.totalResults ?
                                        (
                                            <>
                                                Page: {index + 1}
                                                <span> {(resultsPagination.listingsPageArr[index].listingsPage.length + (index * _pageLimit)) + '/' + resultsPagination.totalResults} </span>
                                            </>
                                        ) :
                                        (<span>'Use the Search Button'</span>)
                                }
                            </h3>


                            <div className={`flex gap-4 flex-col md:flex-row flex-wrap ${styles.paper}`}>
                                {
                                    page.listingsPage.map((listing: any) => (
                                        <div key={listing._id} >
                                            <Card item={listing} />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    ))
                }

                {/* NEXT PAGE */}
                <div className={`${styles.lNext} ${isNextPage ? '' : styles.disappear} `} >
                    {isNextPage && (<>'Loading Next Page...'<span className={styles.spinner} ><ImSpinner2 /></span></>)}
                </div>

                {/* END'S */}
                <div className={`flex !justify-around  ${styles.lNext} ${((formDataRef.current.pageNo && (formDataRef.current.totalResults ?? -1)) &&
                    ((formDataRef.current.pageNo * _pageLimit) >= (formDataRef.current.totalResults ?? -1))) ? '' : styles.disappear} `} >
                    <span>Acabou...</span>
                    <span>Its Ended...</span>
                    <span>C'est Fini...</span>
                </div>

            </div>
            <UpdateModal isOpen={loading} />
        </div>
    )
}