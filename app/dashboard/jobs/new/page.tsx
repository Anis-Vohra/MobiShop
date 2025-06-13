import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { JobForm } from "@/components/forms/job-form"

export default function NewJobPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Create Job</h2>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>Create a new job for a customer.</CardDescription>
        </CardHeader>
        <CardContent>
          <JobForm />
        </CardContent>
      </Card>
    </div>
  )
}
