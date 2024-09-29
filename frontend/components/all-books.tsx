"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import axios from "axios"
import { Book, SearchParams } from "@/lib/types"
import { bookEndpoints } from "@/lib/endpoints"

export default function AllBooksTable() {
    const [books, setBooks] = useState<Book[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searchParams, setSearchParams] = useState<SearchParams>({
        name: "",
        category: "",
        minRent: "",
        maxRent: "",
    })

    // Fetch all books
    useEffect(() => {
        fetchAllBooks()
    }, [])

    // Function to fetch all books from the API
    const fetchAllBooks = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await axios.get(bookEndpoints.GET_ALL_BOOKS)
            setBooks(res.data)
        } catch (error) {
            console.error("Error fetching books:", error)
            setError("Failed to fetch books. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    // Function to handle search based on different criteria
    const handleSearch = async (searchType: string) => {
        setLoading(true)
        setError(null)
        try {
            let url = ''
            switch (searchType) {
                case 'name':
                    url = `${bookEndpoints.SEARCH_BOOK_BY_NAME}?term=${searchParams.name}`
                    break
                case 'rent':
                    url = `${bookEndpoints.SEARCH_BOOK_BY_RENT}?min=${searchParams.minRent}&max=${searchParams.maxRent}`
                    break
                case 'combined':
                    url = `${bookEndpoints.SEARCH_BOOK_BY_CATEGORY}?term=${searchParams.name}&category=${searchParams.category}&min=${searchParams.minRent}&max=${searchParams.maxRent}`
                    break
            }
            const res = await axios.get(url)
            setBooks(res.data)
        } catch (error) {
            console.error("Error searching books:", error)
            setError("Failed to search books. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    // Function to handle input changes for search parameters
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setSearchParams((prev) => ({ ...prev, [name]: value }))
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>All Books</CardTitle>
                <CardDescription>Search and view books in the library</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="name" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="name">Search by Name</TabsTrigger>
                        <TabsTrigger value="rent">Search by Rent</TabsTrigger>
                        <TabsTrigger value="combined">Combined Search</TabsTrigger>
                    </TabsList>
                    <TabsContent value="name" className="mt-4">
                        <div className="flex items-center space-x-2">
                            <Input
                                name="name"
                                placeholder="Enter book name or term"
                                value={searchParams.name}
                                onChange={handleInputChange}
                            />
                            <Button onClick={() => handleSearch('name')}>Search</Button>
                        </div>
                    </TabsContent>
                    <TabsContent value="rent" className="mt-4">
                        <div className="flex items-center space-x-2">
                            <Input
                                name="minRent"
                                type="number"
                                placeholder="Min Rent"
                                value={searchParams.minRent}
                                onChange={handleInputChange}
                            />
                            <Input
                                name="maxRent"
                                type="number"
                                placeholder="Max Rent"
                                value={searchParams.maxRent}
                                onChange={handleInputChange}
                            />
                            <Button onClick={() => handleSearch('rent')}>Search</Button>
                        </div>
                    </TabsContent>
                    <TabsContent value="combined" className="mt-4">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <Input
                                name="name"
                                placeholder="Book name or term"
                                value={searchParams.name}
                                onChange={handleInputChange}
                            />
                            <Input
                                name="category"
                                placeholder="Category"
                                value={searchParams.category}
                                onChange={handleInputChange}
                            />
                            <Input
                                name="minRent"
                                type="number"
                                placeholder="Min Rent"
                                value={searchParams.minRent}
                                onChange={handleInputChange}
                            />
                            <Input
                                name="maxRent"
                                type="number"
                                placeholder="Max Rent"
                                value={searchParams.maxRent}
                                onChange={handleInputChange}
                            />
                        </div>
                        <Button onClick={() => handleSearch('combined')} className="w-full">Search</Button>
                    </TabsContent>
                </Tabs>

                {loading && (
                    <div className="flex justify-center items-center mt-4">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span className="ml-2">Searching...</span>
                    </div>
                )}

                {error && <p className="text-red-500 mt-4">{error}</p>}

                {!loading && !error && (
                    <Table className="mt-6">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Sr No.</TableHead>
                                <TableHead>Book Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Rent per Day</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {books.map((book, index) => (
                                <TableRow key={book._id}>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell>{book.book_name}</TableCell>
                                    <TableCell>{book.category}</TableCell>
                                    <TableCell>${book.rent_per_day.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

                {!loading && !error && books.length === 0 && (
                    <p className="text-center text-gray-500 mt-4">No books found.</p>
                )}
            </CardContent>
        </Card>
    )
}