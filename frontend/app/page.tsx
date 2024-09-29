import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Users, RotateCcw, FileText } from "lucide-react"
import AllBooksTable from "@/components/all-books"
import AllUsersTable from "@/components/all-users"
import IssueBookForm from "@/components/issue-book"
import ReturnBookForm from "@/components/return-book"
import ReportsForm from "@/components/report"
import { ModeToggle } from "../components/mode-toggle"

// Define types
// type Book = {
//   _id: string
//   book_name: string
//   category: string
//   rent_per_day: number
// }

// type User = {
//   _id: string
//   name: string
//   email: string
// }

// type Transaction = {
//   _id: string
//   book_name: string
//   user_id: string
//   user_name: string
//   status: 'ISSUED' | 'RETURNED'
//   rent: number
//   issue_date: Date
//   return_date: Date
// }

export default function Page() {

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center md:px-10 md:py-5">
        <p className="text-3xl font-bold mb-4">Library Management System</p>
        <ModeToggle/>
      </div>
      <Tabs defaultValue="all-books" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all-books" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            All Books
          </TabsTrigger>
          <TabsTrigger value="all-users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            All Users
          </TabsTrigger>
          <TabsTrigger value="issue" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Issue Book
          </TabsTrigger>
          <TabsTrigger value="return" className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Return Book
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Reports
          </TabsTrigger>
        </TabsList>
        <div className="max-w-2xl mx-auto w-full md:my-12">
          <TabsContent value="all-books">
            <AllBooksTable />
          </TabsContent>
          <TabsContent value="all-users">
            <AllUsersTable />
          </TabsContent>
          <TabsContent value="issue">
            <IssueBookForm />
          </TabsContent>
          <TabsContent value="return">
            <ReturnBookForm />
          </TabsContent>
          <TabsContent value="reports">
            <ReportsForm />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}