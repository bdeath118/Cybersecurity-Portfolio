"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

export function FallbackManager() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Fallback Data Status</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">
          This section provides information about the fallback data used when the database is unreachable or empty.
          Fallback data ensures the portfolio remains functional even without a live database connection.
        </p>

        <div className="space-y-4">
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>What is Fallback Data?</AlertTitle>
            <AlertDescription>
              Fallback data is pre-defined static data embedded directly in the application. It acts as a safety net,
              allowing the portfolio to display content (projects, skills, etc.) if there are issues fetching data from
              the Supabase database.
            </AlertDescription>
          </Alert>

          <Alert variant="default">
            <Terminal className="h-4 w-4" />
            <AlertTitle>When is Fallback Data Used?</AlertTitle>
            <AlertDescription>
              Fallback data is automatically used in the following scenarios:
              <ul className="list-disc pl-5 mt-2">
                <li>If the Supabase database is not configured or its environment variables are missing.</li>
                <li>If the application fails to connect to the Supabase database.</li>
                <li>
                  If a specific table in the Supabase database is empty or returns an error during a fetch operation.
                </li>
              </ul>
              This ensures a seamless user experience and prevents a blank page.
            </AlertDescription>
          </Alert>

          <Alert variant="default">
            <Terminal className="h-4 w-4" />
            <AlertTitle>How to Manage Fallback Data?</AlertTitle>
            <AlertDescription>
              Fallback data is hardcoded within the `lib/data.ts` file. To modify it:
              <ol className="list-decimal pl-5 mt-2">
                <li>Locate `lib/data.ts` in your project.</li>
                <li>Edit the `fallbackProjects`, `fallbackSkills`, `fallbackCertifications`, etc., arrays directly.</li>
                <li>Rebuild and redeploy your application for changes to take effect.</li>
              </ol>
              <p className="mt-2 font-medium">
                Note: For persistent data management, it is highly recommended to use the Supabase database and the
                respective managers (e.g., Projects Manager, Skills Manager) in this admin dashboard.
              </p>
            </AlertDescription>
          </Alert>

          <Alert variant="default">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Current Fallback Status</AlertTitle>
            <AlertDescription>
              The application is currently configured to use fallback data if database operations fail. You can verify
              the active data source by checking the console logs for messages like "Using fallback data for [table
              name]."
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  )
}
