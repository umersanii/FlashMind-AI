// Simple system model implementation
export async function getSystemSettings() {
  try {
    const response = await fetch("/api/settings")
    if (!response.ok) {
      throw new Error("Failed to fetch settings")
    }
    return await response.json()
  } catch (error) {
    console.error("Error getting system settings:", error)
    throw error
  }
}

export async function updateSystemSettings(settings) {
  try {
    const response = await fetch("/api/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    })
    if (!response.ok) {
      throw new Error("Failed to update settings")
    }
    return await response.json()
  } catch (error) {
    console.error("Error updating system settings:", error)
    throw error
  }
}
