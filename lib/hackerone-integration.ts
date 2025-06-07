interface HackerOneReport {
  id: string
  title: string
  state: string
  severity_rating: string
  bounty_amount?: number
  disclosed_at?: string
  created_at: string
  vulnerability_information: string
  program: {
    name: string
  }
  cve_ids?: string[]
}

interface HackerOneProfile {
  username: string
  reputation: number
  signal: number
  impact: number
}

export class HackerOneIntegration {
  private apiToken: string
  private username: string
  private baseUrl = "https://api.hackerone.com/v1"

  constructor(apiToken?: string, username?: string) {
    this.apiToken = apiToken || process.env.HACKERONE_API_TOKEN || ""
    this.username = username || process.env.HACKERONE_USERNAME || ""
  }

  private async makeRequest(endpoint: string): Promise<any> {
    if (!this.apiToken || !this.username) {
      throw new Error("HackerOne API credentials not configured")
    }

    const auth = Buffer.from(`${this.username}:${this.apiToken}`).toString("base64")

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HackerOne API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async testConnection(): Promise<{ success: boolean; profile?: HackerOneProfile }> {
    try {
      const data = await this.makeRequest(`/users/${this.username}`)
      return {
        success: true,
        profile: {
          username: data.data.attributes.username,
          reputation: data.data.attributes.reputation,
          signal: data.data.attributes.signal,
          impact: data.data.attributes.impact,
        },
      }
    } catch (error) {
      console.error("HackerOne connection test failed:", error)
      return { success: false }
    }
  }

  async getReports(): Promise<any[]> {
    try {
      const data = await this.makeRequest(`/reports?filter[reporter]=${this.username}&page[size]=100`)
      return data.data || []
    } catch (error) {
      console.error("Error fetching HackerOne reports:", error)
      return []
    }
  }

  async importReports(): Promise<{ success: boolean; findings: any[]; imported: number }> {
    try {
      const reports = await this.getReports()
      const findings = reports.map((report) => this.transformReportToFinding(report))

      return {
        success: true,
        findings,
        imported: findings.length,
      }
    } catch (error) {
      console.error("Error importing HackerOne reports:", error)
      return {
        success: false,
        findings: [],
        imported: 0,
      }
    }
  }

  private transformReportToFinding(report: any): any {
    const attributes = report.attributes
    const relationships = report.relationships

    return {
      id: `hackerone-${report.id}`,
      title: attributes.title,
      platform: "hackerone" as const,
      severity: this.mapSeverity(attributes.severity_rating),
      status: this.mapStatus(attributes.state),
      bounty: attributes.bounty_amount_cents ? attributes.bounty_amount_cents / 100 : 0,
      date: attributes.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
      description: attributes.vulnerability_information || "",
      cve: attributes.cve_ids?.[0] || "",
      reportUrl: `https://hackerone.com/reports/${report.id}`,
      company: relationships?.program?.data?.attributes?.name || "Unknown",
    }
  }

  private mapSeverity(severity: string): "critical" | "high" | "medium" | "low" | "info" {
    switch (severity?.toLowerCase()) {
      case "critical":
        return "critical"
      case "high":
        return "high"
      case "medium":
        return "medium"
      case "low":
        return "low"
      default:
        return "info"
    }
  }

  private mapStatus(state: string): "resolved" | "triaged" | "duplicate" | "not-applicable" {
    switch (state?.toLowerCase()) {
      case "resolved":
      case "closed":
        return "resolved"
      case "triaged":
      case "new":
        return "triaged"
      case "duplicate":
        return "duplicate"
      case "not-applicable":
      case "spam":
      case "informative":
        return "not-applicable"
      default:
        return "triaged"
    }
  }
}
