"use client";

import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import axios from "axios";
import { Transaction } from "@/lib/types";
import { transactionEndpoints } from "@/lib/endpoints";

export default function ReturnBookForm() {
    const [returnDate, setReturnDate] = useState<Date>(new Date());
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [returnedTransaction, setReturnedTransaction] = useState<Transaction | null>(null);

    // Fetch transactions on component mount
    useEffect(() => {
        async function fetchTransactions() {
            try {
                const response = await axios.get(transactionEndpoints.GET_ISSUED_BOOKS);
                setTransactions(response.data.transactions);
            } catch (error) {
                console.error("Failed to fetch transactions:", error);
            }
        }
        fetchTransactions();
    }, []);

    // Handle transaction selection
    const handleTransactionSelection = (userId: string) => {
        const transaction = transactions.find(t => t.user_id === userId) || null;
        setSelectedTransaction(transaction);
    };

    // Handle form submission
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (selectedTransaction) {
            try {
                const response = await axios.post(transactionEndpoints.RETURN_BOOK, {
                    bookName: selectedTransaction.book_name,
                    userId: selectedTransaction.user_id,
                    returnDate: returnDate,
                });

                const newReturnedTransaction: Transaction = response.data.transaction;
                setReturnedTransaction(newReturnedTransaction);
            } catch (error) {
                console.error("Failed to return book:", error);
            }
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Return Book</CardTitle>
                <CardDescription>Return a book and calculate rent</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="transactionId">Transaction</Label>
                        <Select name="transactionId" onValueChange={handleTransactionSelection}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a transaction" />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.isArray(transactions) && transactions.map((transaction) => (
                                    <SelectItem key={transaction.user_id} value={transaction.user_id}>
                                        {transaction.book_name} (Issued to: {transaction.user_name})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {selectedTransaction && (
                        <div className="space-y-2">
                            <Label>Current User</Label>
                            <Input value={selectedTransaction.user_name} disabled />
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label>Return Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !returnDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {returnDate ? format(returnDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={returnDate}
                                    // @ts-expect-error - onSelectsame issue as above
                                    onSelect={setReturnDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <Button type="submit" className="w-full">Return Book</Button>
                </form>
            </CardContent>
            <CardFooter>
                {returnedTransaction && (
                    <div className="w-full p-4 bg-muted/80 rounded-md">
                        <h3 className="font-bold ">Book Returned Successfully</h3>
                        <p>Book: {returnedTransaction.book_name}</p>
                        <p>User ID: {returnedTransaction.user_id}</p>
                        {returnedTransaction.return_date && <p>Return Date: {format(returnedTransaction.return_date, 'yyyy-MM-dd')}</p>}
                        <p>Rent Paid: ${returnedTransaction.rent.toFixed(2)}</p>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}
