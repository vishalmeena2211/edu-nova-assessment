
//Book type
export type Book = {
    _id: string
    book_name: string
    category: string
    rent_per_day: number
}

//Search parameters Type
export type SearchParams = {
    name: string
    category: string
    minRent: string
    maxRent: string
}

//User type
export type User = {
    _id: string
    name: string
    email: string
}

//Transaction type
export type Transaction = {
    _id: string;
    book_name: string;
    user_id: string;
    user_name: string;
    status: 'ISSUED' | 'RETURNED';
    rent: number;
    issue_date: Date;
    return_date: Date | null;
};


