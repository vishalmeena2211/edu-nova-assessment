"use server"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"
import { User } from "@/lib/types";
import { userEndpoints } from "@/lib/endpoints";
import { useEffect, useState } from "react";

export default async function AllUsersTable() {

    const [users, setUsers] = useState<User[]>([]);
    useEffect(() => {
        async function fetchUsers() {
            const response = await axios.get(userEndpoints.GET_USERS);
            setUsers(response
                .data);
        }
        fetchUsers();
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>View all registered users</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Sr No.</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users?.map((user, index) => (
                            <TableRow key={user._id}>
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}