// // app/api/analytics/save/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { adminService } from "@/app/(main)/lib/firebase/admin";
//
// export async function POST(request: NextRequest) {
//   try {
//     const { websiteUrl, analysis, clientId, timestamp, reportId } =
//       await request.json();
//
//     if (!websiteUrl || !analysis) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }
//
//     // Save to Firestore
//     const analysisData = {
//       websiteUrl,
//       analysis,
//       clientId: clientId || "anonymous",
//       timestamp: timestamp || new Date().toISOString(),
//       reportId: reportId || Math.random().toString(36).substr(2, 9),
//       score: analysis.score,
//       grade: analysis.grade,
//       totalTests: analysis.totalTestsRun || 0,
//       problemsCount: analysis.problems?.length || 0,
//     };
//
//     const savedAnalysis = await adminService.saveAnalysis(analysisData);
//
//     return NextResponse.json({
//       success: true,
//       analysisId: savedAnalysis.id,
//       message: "Analysis saved successfully",
//     });
//   } catch (error) {
//     console.error("Error saving analysis:", error);
//     return NextResponse.json(
//       { error: "Failed to save analysis" },
//       { status: 500 }
//     );
//   }
// }
//
// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const clientId = searchParams.get("clientId");
//
//     const analyses = await adminService.getAnalyses(clientId);
//
//     return NextResponse.json({
//       success: true,
//       analyses,
//       total: analyses.length,
//     });
//   } catch (error) {
//     console.error("Error fetching analyses:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch analyses" },
//       { status: 500 }
//     );
//   }
// }
