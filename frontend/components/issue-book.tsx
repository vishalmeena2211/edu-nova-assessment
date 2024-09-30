"use client"
import { useState, FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import axios from "axios";
import { Book, Transaction, User } from "@/lib/types";
import { userEndpoints, transactionEndpoints } from "@/lib/endpoints";

export default function IssueBookForm() {
    const [issueDate, setIssueDate] = useState<Date | null>(new Date());
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [availableBooks, setAvailableBooks] = useState<Book[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    // Fetch users on component mount
    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await axios.get(userEndpoints.GET_USERS);
                setUsers(response.data);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        }

        fetchUsers();
    }, []);

    // Fetch available books on component mount
    useEffect(() => {
        async function fetchBooks() {
            try {
                const response = await axios.get(transactionEndpoints.GET_UNISSUED_BOOKS);
                setAvailableBooks(response.data.books);
            } catch (error) {
                console.error('Failed to fetch books:', error);
            }
        }

        fetchBooks();
    }, []);

    // Handle form submission
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);
        const bookId = formData.get("bookId") as string;
        const userId = formData.get("userId") as string;

        const book = availableBooks.find(b => b._id === bookId);
        const user = users.find(u => u._id === userId);
        if (!book || !user) return;

        try {
            const response = await axios.post(transactionEndpoints.ISSUE_BOOK, {
                bookName: book.book_name,
                userId: user._id,
                issueDate: issueDate,
            });

            setTransaction(response.data.transaction);
        } catch (error) {
            console.error('Error issuing book:', error);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Issue Book</CardTitle>
                <CardDescription>Issue a book to a user</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="userId">User</Label>
                            <Select name="userId">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a user" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Users</SelectLabel>
                                        {users.map((user) => (
                                            <SelectItem key={user._id} value={user._id}>{user.name} ({user.email})</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bookId">Book Name</Label>
                            <Select name="bookId">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a book" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Books</SelectLabel>
                                        {availableBooks?.map((book) => (
                                            <SelectItem key={book._id} value={book._id}>{book.book_name}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Issue Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !issueDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {issueDate ? format(issueDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    // @ts-expect-error Celenite doesn't supporting these prop
                                    selected={issueDate} onSelect={setIssueDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <Button type="submit" className="w-full">Issue Book</Button>
                </form>
            </CardContent>
            <CardFooter>
                {transaction && (
                    <div className="w-full p-4 bg-muted/80 rounded-md">
                        <h3 className="font-bold">Book Issued Successfully</h3>
                        <p>Book: {transaction.book_name}</p>
                        <p>User: {transaction.user_name}</p>
                        <p>Issue Date: {format(transaction.issue_date, 'PPP')}</p>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}
