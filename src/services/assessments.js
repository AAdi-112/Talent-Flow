// import { db } from "./db";

// /**
//  * Fetch an assessment by ID with job details
//  * @param {number} assessmentId
//  * @returns {Promise<Object|null>}
//  */
// export async function getAssessmentById(assessmentId) {
//   console.log("🔎 Fetching assessment with ID:", assessmentId);

//   const assessment = await db.assessments.get(Number(assessmentId));
//   if (!assessment) {
//     console.warn("⚠️ Assessment not found:", assessmentId);
//     return null;
//   }

//   // fetch related job
//   const job = await db.jobs.get(assessment.jobId);

//   const fullData = {
//     ...assessment,
//     job: job || null, // attach job info
//   };

//   console.log("✅ Loaded assessment:", fullData);
//   return fullData;
// }

// /**
//  * Fetch all assessments (optionally by jobId)
//  * @param {number|null} jobId
//  * @returns {Promise<Array>}
//  */
// export async function getAssessments(jobId = null) {
//   console.log("🔎 Fetching assessments", jobId ? `for jobId ${jobId}` : "for all jobs");

//   const assessments = jobId
//     ? await db.assessments.where("jobId").equals(Number(jobId)).toArray()
//     : await db.assessments.toArray();

//   // join job info
//   const withJobs = await Promise.all(
//     assessments.map(async (a) => ({
//       ...a,
//       job: await db.jobs.get(a.jobId),
//     }))
//   );

//   console.log("✅ Loaded assessments:", withJobs);
//   return withJobs;
// }


import { db } from "./db";

/**
 * Fetch an assessment by ID with job details
 * @param {number} assessmentId
 * @returns {Promise<Object|null>}
 */
export async function getAssessmentById(assessmentId) {
  console.group("📘 getAssessmentById");
  console.log("🔎 Requested ID:", assessmentId);

  const numericId = Number(assessmentId);
  console.log("🔢 Parsed ID:", numericId);

  const assessment = await db.assessments.get(numericId);
  if (!assessment) {
    console.warn("⚠️ Assessment not found in DB for ID:", numericId);
    console.groupEnd();
    return null;
  }

  console.log("📄 Raw assessment from DB:", assessment);

  // fetch related job
  const job = await db.jobs.get(assessment.jobId);
  if (job) {
    console.log("📌 Found related job:", job);
  } else {
    console.warn("⚠️ No related job found for jobId:", assessment.jobId);
  }

  const fullData = {
    ...assessment,
    job: job || null, // attach job info
  };

  console.log("✅ Returning assessment with job:", fullData);
  console.groupEnd();
  return fullData;
}

/**
 * Fetch all assessments (optionally by jobId)
 * @param {number|null} jobId
 * @returns {Promise<Array>}
 */
export async function getAssessments(jobId = null) {
  console.group("📘 getAssessments");
  console.log("🔎 Fetching assessments", jobId ? `for jobId ${jobId}` : "for ALL jobs");

  const numericJobId = jobId ? Number(jobId) : null;

  let assessments = [];
  if (numericJobId) {
    assessments = await db.assessments.where("jobId").equals(numericJobId).toArray();
    console.log(`📂 Found ${assessments.length} assessment(s) for jobId:`, numericJobId);
  } else {
    assessments = await db.assessments.toArray();
    console.log(`📂 Found ${assessments.length} assessment(s) total`);
  }

  // join job info
  const withJobs = await Promise.all(
    assessments.map(async (a) => {
      const job = await db.jobs.get(a.jobId);
      if (!job) {
        console.warn("⚠️ No job found for assessment:", a.id, "jobId:", a.jobId);
      }
      return { ...a, job: job || null };
    })
  );

  console.log("✅ Returning assessments with jobs:", withJobs);
  console.groupEnd();
  return withJobs;
}

