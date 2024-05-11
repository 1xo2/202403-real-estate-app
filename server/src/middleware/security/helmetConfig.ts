import  helmet  from 'helmet';




// const helmetHeeders: Record<string, string> = {
//     "X-XSS-Protection": "1; mode=block",
//     "X-Content-Type-Options": "nosniff",
//     "Content-Security-Policy": "default-src 'self'",
//     "Strict-Transport-Security": "max-age=31536000; includeSubDomains"
// };
const helmetConfig = () => {
    return helmet({
        contentSecurityPolicy: {
            directives: {                
                // Additional CSP directives
                defaultSrc: ["'self'"],
                // scriptSrc: ["'self'", "'unsafe-inline'", "https://example.com"],
                scriptSrc: ["'self'", "https://example.com", "'sha256-hash-of-script-content'"],
                objectSrc: ["'none'"],
                upgradeInsecureRequests: [],
            },            
            useDefaults: true,          // Use default values for unspecified directives
        },
        hsts: {
            maxAge: 31536000,           // Set HSTS max age
            includeSubDomains: true,    // Include subdomains
        },
        xXssProtection: true,
        noSniff: true,                  //  nosniff:    If the server specifies a content type, the browser will not attempt to sniff the content and will instead render it according to the specified type.        
        crossOriginResourcePolicy: {    // Cross-Origin-Resource-Policy: Blocks others from loading your resources cross-origin
            policy: 'same-origin',      
        },
        originAgentCluster: true,       // Origin-Agent-Cluster: Changes process isolation to be origin-based
        xDnsPrefetchControl: {          // X-DNS-Prefetch-Control: Controls DNS prefetching
            allow: false,               // Setting to disable DNS prefetching
        },
        xPermittedCrossDomainPolicies: {//  Controls cross-domain behavior for Adobe products, like Acrobat
            permittedPolicies: "none" 
        },
        xPoweredBy: false,              // X-Powered-By: Info about the web server. Removed because it could be used in simple attacks
    });
};

export default helmetConfig;
// Cross - Origin - Opener - Policy(COOP):

// Helps prevent cross - origin attacks by isolating your page's execution context.
// Example: Cross - Origin - Opener - Policy: same - origin
// Cross - Origin - Resource - Policy(CORP):

// Controls which origins can load resources from your site, preventing cross - origin information leaks.
//     Example: Cross - Origin - Resource - Policy: same - origin
// Origin - Agent - Cluster:

// Enhances security by providing origin - based process isolation.
//     Example: Origin - Agent - Cluster: ?1
// X - DNS - Prefetch - Control:

// Controls DNS prefetching to mitigate privacy risks.
//     Example: X - DNS - Prefetch - Control: off
// X - Permitted - Cross - Domain - Policies:

// Controls cross - domain behavior for Adobe products like Acrobat.
//     Example: X - Permitted - Cross - Domain - Policies: none
// X - Powered - By:

// Removing this header helps prevent exposing information about the web server, which can be useful for attackers.
//     Example: X - Powered - By: unknown

// Set security headers
// app.use((req, res, next) => {
//     res.setHeader("X-XSS-Protection", "1; mode=block");
//     res.setHeader("X-Content-Type-Options", "nosniff");
//     res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
//     next();
// });
