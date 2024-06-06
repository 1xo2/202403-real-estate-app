import { ChangeEvent, useEffect, useState } from 'react';
import xss from 'xss';
import { IListingFields } from '../../share/types/listings';
import styles from './SearchPage.module.css';
import { fetchHeaders } from '../../share/fetchHeaders';
import { loader } from '../../components/dialogs/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import UpdateModal from '../../components/dialogs/UpdateModal/UpdateModal';
import Card from '../../components/card/Card';


type TDataForm = {
    rent?: boolean;
    sell?: boolean;
    type: 'rent' | 'sale' | undefined; // Include undefined as a valid type
    searchTerm?: string | undefined;
} & Omit<IListingFields, 'type'>;

export default function SearchPage() {
    const dispatch: AppDispatch = useDispatch();
    const { loading } = useSelector((state: RootState) => state.user);

    const _SEARCH_TERM = 'searchTerm';

    const [formData, setFormData] = useState<TDataForm>({} as TDataForm)
    const [resultsData, setResultsData] = useState<IListingFields[]>([])



    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get(_SEARCH_TERM);
        if (searchTermFromUrl) {
            setFormData(prevState => {
                return {
                    ...prevState,
                    searchTerm: searchTermFromUrl
                }
            })
        }

    }, [location.search])


    function fields_eh_Babel(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
        const target = e.target as HTMLInputElement

        let value: boolean | string;
        const key = target.id.split('-')[1]
        if (target) {
            if (target.type === 'checkbox') {
                value = target.checked
            }

            if (target.type === 'select-one') {
                value = target.value
            }

            setFormData(prevState => {
                const d = { ...prevState, [key]: value }
                console.log('d:', d)
                return { ...prevState, [key]: value }
            })

        }

    }

    function textChange_eh(e: ChangeEvent<HTMLInputElement>): void {
        const sanitizedValue = xss(e.target.value || '')

        setFormData(prevState => ({
            ...prevState,
            [_SEARCH_TERM]: sanitizedValue
        }));
    }

    async function searchClick_eh(): Promise<void> {
        loader(async () => {

            const { rent, sell, ...data } = formData
            if (rent === sell) {
                data.type = undefined;
                // delete data.type;
            } else {
                data.type = sell ? 'sale' : 'rent';
            }


            // const arr = []
            // for (const key in data) {
            //     if (data[key as keyof typeof data])
            //         arr.push('&', [key, '=', data[key as keyof typeof data]?.toString()].join(''))
            // }
            // console.log(' a:', arr.join(''))

            const stringifiedData: Record<string, string> = {};
            Object.keys(data).forEach(key => {
                const value = data[key as keyof typeof data];
                if (value !== undefined) {
                    stringifiedData[key] = String(value);
                }
            });

            // Create query parameters
            const params = (new URLSearchParams(stringifiedData)).toString();
            console.log('params:', params)


            const url = `/api/public/search?${params}`;
            const res = await fetch(url, {
                method: 'get',
                headers: fetchHeaders,
            })
            if (!res.ok) {
                throw new Error('Failed to fetch data');
            }

            // const result = await res.json();
            // console.log('result:', result);
            setResultsData(await res.json())

        }, dispatch)
    }

    // function formSubmit_eh(e: FormEvent<HTMLFormElement>): void {
    //     e.preventDefault()
    // }

    return (
        // <div className="mx-auto p-6 max-w-full flex ">
        <div className={styles.parentContainer}>
            <div className={styles.sideLeft}>
                {/* <form onSubmit={formSubmit_eh}></form> */}
                <input type="text" placeholder="Search" onChange={textChange_eh} value={formData.searchTerm} />
                <div id='checkboxesField' onClick={fields_eh_Babel} >
                    {/* TYPES */}
                    <fieldset>
                        <legend>Type</legend>

                        <div className={styles.ctrlBox} >
                            <input type="checkbox" id="chb-rent" title="Rent" />
                            <label htmlFor="chb-rent">Rent</label>
                        </div>
                        <div className={styles.ctrlBox} >
                            <input type="checkbox" id="chb-sale" title="Sale" />
                            <label htmlFor="chb-sale">Sale</label>
                        </div>
                        <div className={styles.ctrlBox} >
                            <input type="checkbox" id="chb-offer" title="Offer" />
                            <label htmlFor="chb-offer">Offer</label>
                        </div>
                    </fieldset>

                    {/* AMENITIES */}
                    <fieldset>
                        <legend>Amenities</legend>

                        <div className={styles.ctrlBox} >
                            <input type="checkbox" id="chb-parking" title="Parking" />
                            <label htmlFor="chb-parking">Parking</label>
                        </div>
                        <div className={styles.ctrlBox} >
                            <input type="checkbox" id="chb-furnished" title="Furnished" />
                            <label htmlFor="chb-furnished">Furnished</label>
                        </div>
                    </fieldset>

                    {/* ORDER */}
                    <fieldset>
                        <legend>Order</legend>

                        <div className={`${styles.ctrlBox} ${styles.ctrlBoxSelect}`} >
                            <label htmlFor="lb-sort">Sort-by:</label>
                            <select id='lb-sort' title='Sort' >
                                <option value="createdAt">Date</option>
                                <option value="price">Price</option>
                                <option value="bedRooms">Bed Rooms</option>
                                <option value="bathrooms">Bath Rooms</option>
                            </select>
                        </div>

                        <div className={`${styles.ctrlBox} ${styles.ctrlBoxSelect}`} >
                            <label htmlFor="lb-orderBy">Order-by:</label>
                            <select id='lb-orderBy' title='orderBy' >
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
                        <h1>Results: ({resultsData.length})</h1>
                        <div className='flex gap-4 flex-col md:flex-row flex-wrap '>
                            {
                                resultsData.map((listing: any) => {
                                    return (
                                        <div key={listing._id} className='w-[30%] h-[20%] overflow-hidden ' >

                                            <Card item={listing} />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </>}
            </div>
            <UpdateModal isOpen={loading} />
        </div>
    )
}