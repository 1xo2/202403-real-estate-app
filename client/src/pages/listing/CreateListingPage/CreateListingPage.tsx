import PageContainer from '../../../components/PageContainer'
import './CreateListingPage.css'

export default function CreateListingPage() {





    const eventBubble_liClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const id = (e.target as HTMLDivElement).id;
        console.log('id:', id);
    }

    const eventHandler_fileOnChange = (e: React.ChangeEvent<HTMLInputElement> | undefined) => {

        if (e?.target.files && e?.target.files.length > 0 && e.target.files[0].type.startsWith('image/')) {

            // setFile(e.target.files[0]);
            //     fileUploadHandler(e.target.files[0])
            // } else {
            //     setFileMsg(
            //         (state) => {
            //             return {
            //                 ...state,
            //                 error: 'Upload is cancel: Only images are allowed.'
            //             }
            //         })

        }
    };




    return (
        <PageContainer h1={"Create Listing Page"} isWide={true} >
            <form id="formListing" className='flex flex-col sm:flex-row gap-7' >
                <div className='rap-side' >
                    {/* //////    INPUTS   //////// */}
                    <input type="text"
                        placeholder='Name'
                        required
                        id="txtName"
                        maxLength={62}
                        minLength={10} />
                    <textarea
                        placeholder='Description'
                        rows={5}
                        required
                        // className='p-3'
                        id="txtDescription"
                        maxLength={62}
                    />
                    <input type="text"
                        placeholder='Address'
                        required
                        id="txtAddress"
                        maxLength={62}
                    />
                    {/* //////    OPTIONS   //////// */}
                    <div onClick={eventBubble_liClick} className='section mt-6' >
                        {
                            Array.from(["Sell", "Rent", "Parking_Spot", "Furnished", "Offer"]).map((option) => (
                                <div key={option} id={`div_${option}`} className='ctrl-warper' >
                                    <input type="checkbox" value={option} id={`chb_${option}`} title={option} className='w-5 h-5 mr-1' />
                                    <label htmlFor={`chb_${option}`}> {option} </label>
                                </div>
                            ))
                        }
                    </div>
                    {/* //////    NUMBERS   //////// */}

                    <div className='section' >
                        <div className="ctrl-warper">
                            <input type="number" placeholder='Beds' id="txtBeds" min={0} max={10} required defaultValue={1} />
                            <span>Beds</span>
                        </div>
                        <div className="ctrl-warper">
                            <input type="number" placeholder='Baths' id="txtBaths" min={0} max={10} required defaultValue={1} />
                            <span>Baths</span>
                        </div>
                        <div className="ctrl-warper">
                            <input type="number" placeholder='Price' id="txtPrice" min={0} required />
                            <p className='flex flex-col'>Price
                                <span className='text-xs'>($ / Month)</span>
                            </p>
                        </div>
                        <div className="ctrl-warper">
                            <input type="number" placeholder='Discounted Price' id="txtDiscountedPrice" min={0} required />
                            <p className='flex flex-col' >Discounted Price
                                <span className='text-xs'>($ / Month)</span>
                            </p>

                        </div>
                    </div>

                </div>
                <div className="rap-side">

                    <div className="section">
                        <p className="font-semibold">Images:
                            <span className="font-normal font-gray-600">&nbsp;The first image will be the cover (max 6)</span></p>

                        <div className="flex gap-3">
                            <input onChange={eventHandler_fileOnChange} type="file" className='rounded border border-gray-300 p-3 w-full' id="images"
                                accept='image/*' multiple placeholder='Add images' />
                            <button className='p-3 border border-green-700 text-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80 ' type="button">Upload</button>
                        </div>
                    </div>
                    <button type="button" className='btnBig bg-slate-800 w-full' >Create Listing</button>
                </div>

            </form>
        </PageContainer>
    )
}