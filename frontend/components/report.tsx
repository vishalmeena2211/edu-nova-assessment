"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import axios from "axios";
import { Book, DateRange, ReportResult, User } from "@/lib/types";
import { bookEndpoints, userEndpoints, transactionEndpoints } from "@/lib/endpoints";


export default function ReportsForm() {
    const [reportType, setReportType] = useState<string>("");
    const [reportInput, setReportInput] = useState<string>("");
    const [reportResult, setReportResult] = useState<ReportResult | null>(null);
    const [dateRange, setDateRange] = useState<DateRange>({ from: new Date(), to: new Date() });
    const [books, setBooks] = useState<Book[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    // Fetch books and users on component mount
    useEffect(() => {
        async function fetchBooks() {
            try {
                const response = await axios.get(bookEndpoints.GET_ALL_BOOKS);
                setBooks(response.data);
            } catch (error) {
                console.error('Failed to fetch books:', error);
            }
        }

        async function fetchUsers() {
            try {
                const response = await axios.get(userEndpoints.GET_USERS);
                setUsers(response.data);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        }

        Promise.all([fetchBooks(), fetchUsers()]);
    }, []);

    // Generate report based on selected type
    const generateReport = async () => {
        try {
            let response;
            switch (reportType) {
                case "bookHistory":
                    response = await axios.post(transactionEndpoints.GET_BOOK_HISTORY, { bookName: reportInput });
                    setReportResult({
                        totalIssues: response.data.totalIssuedCount,
                        currentlyIssuedTo: response.data.currentlyIssued,
                        history: response.data.history
                    });
                    break;
                case "bookRent":
                    response = await axios.post(transactionEndpoints.GET_BOOK_RENT, { bookName: reportInput });
                    setReportResult({ totalRent: response.data.totalRent });
                    break;
                case "userBooks":
                    response = await axios.post(transactionEndpoints.GET_USER_BOOKS, { userId: reportInput });
                    setReportResult({ issuedBooks: response.data.books });
                    break;
                case "dateRange":
                    response = await axios.post(transactionEndpoints.GET_BOOKS_ISSUED_IN_DATE_RANGE, { from: dateRange.from, to: dateRange.to });
                    setReportResult({ issuedBooks: response.data.transactions });
                    break;
            }
        } catch (error) {
            console.error('Failed to generate report:', error);
        }
    };

    // Handle report type selection
    const handleSelectReport = (value: string) => {
        setReportType(value);
        setReportInput("");
        setReportResult(null);
        setDateRange({ from: new Date(), to: new Date() });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Generate Reports</CardTitle>
                <CardDescription>View various reports about books and users</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="reportType">Report Type</Label>
                        <Select onValueChange={handleSelectReport}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select report type" />
                            </SelectTrigger>
                            <SelectContent className="max-h-52">
                                <SelectItem value="bookHistory">Book History</SelectItem>
                                <SelectItem value="bookRent">Book Total Rent</SelectItem>
                                <SelectItem value="userBooks">Users Issued Books</SelectItem>
                                <SelectItem value="dateRange">Books Issued in Date Range</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {(reportType === "bookHistory" || reportType === "bookRent") && (
                        <div className="space-y-2">
                            <Label htmlFor="bookSelect">Book Name</Label>
                            <Select onValueChange={setReportInput}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a book" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Books</SelectLabel>
                                        {books.map((book) => (
                                            <SelectItem key={book._id} value={book.book_name}>{book.book_name}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    {reportType === "userBooks" && (
                        <div className="space-y-2">
                            <Label htmlFor="userSelect">User</Label>
                            <Select onValueChange={setReportInput}>
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
                    )}
                    {reportType === "dateRange" && (
                        <div className="space-y-2">
                            <Label>Date Range</Label>
                            <div className="flex flex-col md:flex-row gap-4 md:gap-0 md:space-x-2">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={"outline"}>
                                            {dateRange.from ? format(dateRange.from, "PPP") : <span>From</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={dateRange.from}

                                            onSelect={(date) => setDateRange((prev) => ({ ...prev, from: date || prev.from }))} // Set start date
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={"outline"}>
                                            {dateRange.to ? format(dateRange.to, "PPP") : <span>To</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={dateRange.to}
                                            onSelect={(date) => setDateRange((prev) => ({ ...prev, to: date || prev.to }))} // Set end date
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    )}
                    <Button onClick={generateReport} className="w-full">Generate Report</Button>
                </div>
            </CardContent>
            <CardFooter>
                {reportResult && (
                    <div className="w-full p-4 bg-muted/80 rounded-md">
                        <h3 className="font-bold mb-2">Report Result</h3>
                        {reportType === "bookHistory" && (
                            <>
                                <p>Total Issues: {reportResult.totalIssues}</p>
                                <p>Currently Issued To: {reportResult.currentlyIssuedTo}</p>
                                <h4 className="font-semibold mt-2">Issue History:</h4>
                                <ul className="list-disc pl-5">
                                    {reportResult.history?.map((t, index) => (
                                        <li key={index}>
                                            Issued to {t.user_name} on {format(t.issue_date, "PPP")}
                                            {t.return_date ? `, returned on ${format(t.return_date, "PPP")}` : " (not returned yet)"}
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                        {reportType === "bookRent" && (
                            <p>Total Rent Generated: ${reportResult.totalRent?.toFixed(2)}</p>
                        )}
                        {reportType === "userBooks" && (
                            <>
                                <h4 className="font-semibold">Currently Issued Books:</h4>
                                <ul className="list-disc pl-5">
                                    {reportResult.issuedBooks?.map((book, index) => (
                                        <li key={index}>{book.book_name} (Issued on: {format(book.issue_date, "PPP")})</li>
                                    ))}
                                </ul>
                            </>
                        )}
                        {reportType === "dateRange" && (
                            <>
                                <h4 className="font-semibold">Books Issued in Date Range:</h4>
                                <ul className="list-disc pl-5">
                                    {reportResult.issuedBooks?.map((book, index) => (
                                        <li key={index}>{book.book_name} (Issued to: {book.user_name} on {format(book.issue_date, "PPP")})</li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}
