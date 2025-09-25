// helpers/candidateHelpers.js
export async function updateCandidateStage(
  candidate,
  newStage,
) {
  console.log("🔧 updateCandidateStage called:", { candidate, newStage });
  // Call backend API (PATCH)
  try {
    const res = await fetch(`/api/candidates/${candidate}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        stage: newStage,
        transitionDate: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      console.error("❌ Failed to update backend:", res.status, res.statusText);
    } else {
      console.log("✅ Backend updated successfully:", candidate.id, "➡️", newStage);
    }
  } catch (err) {
    console.error("💥 Error in backend update:", err);
  }
}
