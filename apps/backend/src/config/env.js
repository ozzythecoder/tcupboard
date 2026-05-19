export const env = {
    google: {
        credentials: process.env.GOOGLE_CREDENTIALS,
        spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
    },
    xenforo: {
        clientId: process.env.REACT_APP_XENFORO_CLIENT_ID,
        clientSecret: process.env.XENFORO_CLIENT_SECRET,
    },
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
    },
    db: {
        connectionString: process.env.DB_URL,
        schema: process.env.DB_SCHEMA,
    },
    supabase: {
        url: process.env.SUPABASE_URL,
        serviceKey: process.env.SUPABASE_SERVICE_KEY,
    },
    auth0: {
        domain: process.env.AUTH0_DOMAIN,
        apiIdentifier: process.env.AUTH0_API_IDENTIFIER,
    },
};
