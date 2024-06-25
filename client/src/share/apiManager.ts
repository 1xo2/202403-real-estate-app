import xss from "xss";
export const fetchHeaders: Record<string, string> = {
    // Specifies the media type of the resource being sent to the server.
    // Setting it to "application/json" indicates that the content is JSON data.
    "Content-Type": "application/json",

    // Enables the browser's built-in Cross-Site Scripting (XSS) filter.
    // It helps prevent XSS attacks by instructing the browser to block pages when it detects potential XSS attacks.
    "X-XSS-Protection": "1; mode=block",

    // Prevents MIME-sniffing attacks by instructing the browser to honor the declared Content-Type
    // and not try to MIME-sniff the response.
    "X-Content-Type-Options": "nosniff",

    // Provides clickjacking protection by indicating whether a browser should be allowed to render a page in a frame.
    // Setting it to "DENY" ensures that the page cannot be embedded in a frame.
    "X-Frame-Options": "DENY",

    // Defines a policy that specifies the valid sources of content that the browser should consider executing or rendering.
    // It helps mitigate various types of attacks, including XSS and data injection attacks,
    // by restricting the resources that a page can load and execute.
    // Here, we've set it to allow resources from the same origin ('self').
    "Content-Security-Policy": "default-src 'self'",
};

// const headers_test = {
//     'Accept': '*/*',
//     'Content-Type': 'application/json',    
// }


const __baseURL = import.meta.env.VITE_APP_API_ENDPOINT;


type TApi = {
    urlPath: string;
    httpMethod: 'get' | 'post' | 'delete' | 'put';
    apiParam?: object | string;
};
// type ApiResponse = {
//     success: boolean;
//     statusCode: number;
//     message: string;
//     msg: string;
//     errorName: string;
//     error: any;
// };


export async function apiManager({ httpMethod, urlPath, apiParam }: TApi): Promise<any> {
    try {
        let fullUrl = `${__baseURL}${urlPath}`;
        
        const options: RequestInit = {
            method: httpMethod.toUpperCase(),
            headers: fetchHeaders,
            // headers: {
            //     'Accept': '*/*',
            //     'Content-Type': 'application/json',               
            // }, 
            credentials: 'include'
        };

        if ((httpMethod === 'get' || httpMethod === 'delete') && apiParam) {
            if (typeof apiParam === 'object') {
                const queryString = new URLSearchParams(apiParam as Record<string, string>).toString();
                fullUrl = `${fullUrl}?${xss(queryString)}`;
            } else if (typeof apiParam === 'string') {
                fullUrl = `${fullUrl}?${xss(apiParam)}`;
            }
        } else if ((httpMethod === 'post' || httpMethod === 'put') && apiParam) {
            options.body = xss((typeof apiParam === 'object') ? JSON.stringify(apiParam) : apiParam);
        }


        const res = await fetch(fullUrl, options);

        // if (!res.ok) {
        //     console.log('res:', res)
        //     const errorData = await res.json();
        //     console.log('errorData:', errorData)
        //     throw new Error(`HTTP error! Status: ${res.status} - ${errorData.message}`);
        // }

        const data = await res.json();
        return { data, res };

    } catch (error) {
        console.error('API error:', error);
        throw error;
    }
}
