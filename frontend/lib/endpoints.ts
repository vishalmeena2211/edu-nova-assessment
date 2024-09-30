const BASE_URL = "https://edu-nova-assessment.onrender.com/api/v1";

// Book Endpoints
export const bookEndpoints = {
    GET_ALL_BOOKS: BASE_URL + "/books",
    GET_BOOK_BY_ID: BASE_URL + "/books/:id",
    CREATE_BOOK: BASE_URL + "/books",
    SEARCH_BOOK_BY_NAME: BASE_URL + "/books/search/name",
    SEARCH_BOOK_BY_RENT: BASE_URL + "/books/search/rent",
    SEARCH_BOOK_BY_CATEGORY: BASE_URL + "/books/search/category"
};

// User Endpoints
export const userEndpoints = {
    CREATE_USER: BASE_URL + "/users",
    GET_USERS: BASE_URL + "/users/",
    GET_USER_BY_ID: BASE_URL + "/users/:id"
};

// Transaction Endpoints
export const transactionEndpoints = {
    ISSUE_BOOK: BASE_URL + "/transactions/issue",
    RETURN_BOOK: BASE_URL + "/transactions/return",
    GET_BOOK_HISTORY: BASE_URL + "/transactions/history",
    GET_BOOK_RENT: BASE_URL + "/transactions/rent",
    GET_USER_BOOKS: BASE_URL + "/transactions/user-books",
    GET_BOOKS_ISSUED_IN_DATE_RANGE: BASE_URL + "/transactions/date-range",
    GET_ISSUED_BOOKS: BASE_URL + "/transactions/issued-books",
    GET_UNISSUED_BOOKS: BASE_URL + "/transactions/un-issued-books"
};
