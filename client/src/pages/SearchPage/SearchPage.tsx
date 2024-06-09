import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import xss from 'xss';
import Card from '../../components/card/Card';
import { loader } from '../../components/dialogs/Loader';
import UpdateModal from '../../components/dialogs/UpdateModal/UpdateModal';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchHeaders } from '../../share/fetchHeaders';
import { IListingFields } from '../../share/types/listings';
import styles from './SearchPage.module.css';


type TDataForm = {
    rent?: boolean;
    sale?: boolean;
    type: 'rent' | 'sale' | null; // Include null as a valid type
    sort: string;
    order: string;
    searchTerm?: string | null;
    totalResults?: string;
    currentPageNo: string;
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
    totalResults: '',
    currentPageNo: '1'
}

type TResponseApi = {
    listingsPage: IListingFields[];
    currentPageNo: number;
    totalResults: number;
}

type TPage = {} & Omit<TResponseApi, 'totalResults'>

type TPagination = {
    listingsPageArr: [TPage];
    totalResults: number;
}
export default function SearchPage() {
    const dispatch: AppDispatch = useDispatch();
    const { loading } = useSelector((state: RootState) => state.user);
    const navigate = useNavigate()



    const [formData, setFormData] = useState<TDataForm>(_formDataIni as TDataForm)
    const [resultsData, setResultsData] = useState<IListingFields[]>([])
    const [resultsPagination, setResultsPagination] = useState<TPagination>({} as TPagination)

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        // Loop through form data keys and set state based on URL params
        (Object.keys(_formDataIni) as (keyof TDataForm)[]).forEach(key => {
            const sValue = urlParams.get(key);

            // !the xss is string type
            let value: any = (sValue !== undefined && sValue !== null && sValue !== '') ? xss(String(sValue)) : _formDataIni[key];

            // Parse the value based on expected type
            if (typeof _formDataIni[key] === 'boolean') {
                value = value === 'true';
            }

            setFormData(prevState => ({
                ...prevState,
                [key]: value
            }));
            // console.log('Parsed value:', key, value, typeof value);
        });


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


            setFormData(prevState => {
                const state = { ...prevState, [key]: value }
                // console.log('state:', state)
                return { ...prevState, [key]: value }
            })
        }

    }

    const getUrlParamsFromObject = (data: TDataForm) => {
        const stringifiedData: Record<string, string> = {};
        Object.keys(data).forEach(key => {
            const value = data[key as keyof typeof data];
            if (value !== null && value !== undefined && value !== false && value !== '') {
                if (value !== 'ascending' && value !== 'createdAt') { // api default value
                    // console.log('key: value:', value, key)
                    stringifiedData[key] = String(value);
                }
            }
        });

        return (new URLSearchParams(stringifiedData)).toString()
    }

    // Handle search button click
    async function searchClick_eh(): Promise<void> {
        loader(async () => {

            const { rent, sale, ...data } = formData
            if (rent === sale) {
                data.type = null;
                // delete data.type;
            } else {
                data.type = sale ? 'sale' : 'rent';
            }

            // api params
            // const stringifiedData: Record<string, string> = {}
            // Object.keys(data).forEach(key => {
            //     const value = data[key as keyof typeof data];
            //     if (value !== null) {
            //         stringifiedData[key] = String(value);
            //     }
            // });

            // Create query parameters
            // const params = (new URLSearchParams(stringifiedData)).toString();
            // console.log('data:', data)
            const params = getUrlParamsFromObject(data)
            // console.log('api params:', params)


            const url = `/api/public/search?${params}`;
            const res = await fetch(url, {
                method: 'get',
                headers: fetchHeaders,
            })
            if (!res.ok) {
                throw new Error('Failed to fetch data');
            }

            const results: TResponseApi = await res.json()
            setResultsData(results.listingsPage)



            const page: TPage = {
                listingsPage: results.listingsPage,
                currentPageNo: results.currentPageNo
            }

            setResultsPagination(prevState => {
                return {
                    ...prevState,
                    listingsPageArr: [page],                    
                    totalResults: results.totalResults,
                }
            })



            
            setFormData(prevState => {
                return {
                    ...prevState,
                    totalResults: results.totalResults.toString(),
                    currentPageNo: results.currentPageNo.toString()
                }
            })


            // Prepare stringified data for URL search parameters           
            // const urlParams = new URLSearchParams()
            // Object.keys(formData).forEach(key => {
            //     const value = formData[key as keyof typeof formData];
            //     if (value !== undefined && value !== null) {            
            //         urlParams.set(key, String(value))
            //     }
            // })

            // const searchQuery = urlParams.toString();
            // console.log('formData:', formData)


            const searchQuery = getUrlParamsFromObject({
                ...formData,
                totalResults: results.totalResults.toString(),
                currentPageNo: results.currentPageNo.toString()
            })
            // console.log('searchQuery:', searchQuery)
            navigate(`/search?${searchQuery}`)


        }, dispatch)
    }


    return (
        // <div className="mx-auto p-6 max-w-full flex ">
        <div className={styles.parentContainer}>
            <div className={styles.sideLeft} onChange={fields_eh_Babel}>
                {/* <form onSubmit={formSubmit_eh}></form> */}
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
            <div className={styles.sideRight} >

                {resultsData && 
                
                <>
                    <h1>Results: {formData.totalResults ? resultsData.length + '/' + resultsPagination.totalResults : <span className='italic text-base opacity-80 ' >'Use the Search Button'</span>}</h1>
                    <div className={`flex gap-4 flex-col md:flex-row flex-wrap ${styles.paper}`}>
                        {
                            resultsData.map((listing: any) => {
                                return (
                                    <div key={listing._id} className='' >

                                        <Card item={listing} />
                                    </div>
                                )
                            })
                        }
                    </div>
                </>
                
                }
            </div>
            <UpdateModal isOpen={loading} />
        </div>
    )
}