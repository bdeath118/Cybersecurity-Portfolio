import fetch from "node-fetch"

// Configuration
const BASE_URL = process.env.SITE_URL || "http://localhost:3000"
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "password"

console.log("🔍 Starting Admin API Verification During Construction Mode")
console.log(`Base URL: ${BASE_URL}`)

// Test authentication and get session cookie
async function authenticateAdmin() {
  console.log("\n🔐 Testing Admin Authentication...")

  try {
    const response = await fetch(`${BASE_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: ADMIN_USERNAME,
        password: ADMIN_PASSWORD,
      }),
    })

    const data = await response.json()
    const cookies = response.headers.get("set-cookie")

    console.log("✅ Authentication Response:", {
      status: response.status,
      success: data.success,
      hasCookies: !!cookies,
    })

    if (data.success && cookies) {
      // Extract the admin-auth cookie
      const authCookie = cookies.split(";")[0]
      console.log("🍪 Auth Cookie:", authCookie)
      return authCookie
    }

    throw new Error("Authentication failed")
  } catch (error) {
    console.error("❌ Authentication Error:", error.message)
    return null
  }
}

// Test API endpoints with authentication
async function testAPIEndpoint(endpoint, method = "GET", body = null, authCookie = null) {
  console.log(`\n🧪 Testing ${method} ${endpoint}...`)

  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    }

    if (authCookie) {
      options.headers.Cookie = authCookie
    }

    if (body) {
      options.body = JSON.stringify(body)
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options)
    const data = await response.json()

    console.log(`✅ ${endpoint} Response:`, {
      status: response.status,
      ok: response.ok,
      hasData: !!data,
    })

    return { response, data }
  } catch (error) {
    console.error(`❌ ${endpoint} Error:`, error.message)
    return { error: error.message }
  }
}

// Main verification function
async function verifyAdminAPI() {
  console.log("🚀 Starting comprehensive API verification...\n")

  // Step 1: Authenticate
  const authCookie = await authenticateAdmin()
  if (!authCookie) {
    console.error("❌ Cannot proceed without authentication")
    return
  }

  // Step 2: Test Under Construction API
  console.log("\n📋 Testing Under Construction Management...")
  await testAPIEndpoint("/api/under-construction", "GET", null, authCookie)
  await testAPIEndpoint(
    "/api/under-construction",
    "POST",
    {
      enabled: true,
      message: "API Test - Under Construction",
      progressPercentage: 80,
      allowAdminAccess: true,
    },
    authCookie,
  )

  // Step 3: Test Core Content APIs
  console.log("\n📋 Testing Core Content APIs...")
  await testAPIEndpoint("/api/site-info", "GET", null, authCookie)
  await testAPIEndpoint("/api/projects", "GET", null, authCookie)
  await testAPIEndpoint("/api/skills", "GET", null, authCookie)
  await testAPIEndpoint("/api/certifications", "GET", null, authCookie)
  await testAPIEndpoint("/api/ctf-events", "GET", null, authCookie)
  await testAPIEndpoint("/api/digital-badges", "GET", null, authCookie)

  // Step 4: Test Advanced Features
  console.log("\n🔧 Testing Advanced Feature APIs...")
  await testAPIEndpoint("/api/advanced-settings", "GET", null, authCookie)
  await testAPIEndpoint("/api/import-settings", "GET", null, authCookie)
  await testAPIEndpoint("/api/bug-bounty", "GET", null, authCookie)
  await testAPIEndpoint("/api/security-articles", "GET", null, authCookie)
  await testAPIEndpoint("/api/osint-capabilities", "GET", null, authCookie)

  // Step 5: Test Integration APIs
  console.log("\n🔗 Testing Integration APIs...")
  await testAPIEndpoint("/api/integrations/status", "GET", null, authCookie)
  await testAPIEndpoint("/api/auth/linkedin/status", "GET", null, authCookie)
  await testAPIEndpoint("/api/auth/credly/status", "GET", null, authCookie)
  await testAPIEndpoint("/api/auth/github/status", "GET", null, authCookie)

  // Step 6: Test Security APIs
  console.log("\n🔒 Testing Security APIs...")
  await testAPIEndpoint("/api/security-scan", "GET", null, authCookie)
  await testAPIEndpoint("/api/deployment-status", "GET", null, authCookie)
  await testAPIEndpoint("/api/env-check", "GET", null, authCookie)

  // Step 7: Test Health Check
  console.log("\n❤️ Testing Health Check APIs...")
  await testAPIEndpoint("/api/health", "GET")
  await testAPIEndpoint("/api/healthz", "GET")

  console.log("\n🎉 API Verification Complete!")
}

// Run the verification
verifyAdminAPI().catch(console.error)
