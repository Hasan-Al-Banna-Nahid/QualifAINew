// app/qualifai/social-media/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Share2, Play, MessageCircle, Image, CheckCircle2, XCircle } from "lucide-react";

export default function SocialMediaQAPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId");

  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);

  const runSocialTests = async () => {
    setIsTesting(true);

    // Simulate Social Media QA testing
    const tests = [
      { name: "Image Dimensions Check", status: "running" },
      { name: "Hashtag Strategy Analysis", status: "running" },
      { name: "Posting Schedule Verification", status: "running" },
      { name: "Platform Compliance Check", status: "running" },
      { name: "Link Verification", status: "running" },
      { name: "Engagement Potential Score", status: "running" },
      { name: "Brand Voice Consistency", status: "running" },
    ];

    setTestResults(tests);

    // Simulate test execution
    for (let i = 0; i < tests.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setTestResults((prev) =>
        prev.map((test, index) =>
          index === i
            ? { ...test, status: Math.random() > 0.1 ? "passed" : "failed" }
            : test
        )
      );
    }

    setIsTesting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/50 via-rose-50/50 to-red-50/50 dark:from-gray-900 dark:via-pink-900/20 dark:to-rose-900/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <Share2 className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                Social Media QA
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Social content calendar and post quality assurance
              </p>
            </div>
          </div>
        </div>

        {/* Test Interface */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Social Media Audit
            </h2>
            <button
              onClick={runSocialTests}
              disabled={isTesting}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl hover:from-pink-600 hover:to-rose-600 disabled:opacity-50 transition-all duration-300"
            >
              <Play className="w-4 h-4" />
              <span>{isTesting ? "Auditing..." : "Run Social Audit"}</span>
            </button>
          </div>

          {/* Test Results */}
          <div className="space-y-4">
            {testResults.map((test, index) => (
              <motion.div
                key={test.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  {test.status === "running" && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-5 h-5 border-2 border-pink-500 border-t-transparent rounded-full"
                    />
                  )}
                  {test.status === "passed" && (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                  {test.status === "failed" && (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {test.name}
                  </span>
                </div>

                {test.status === "running" && (
                  <div className="flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{
                          duration: 0.6,
                          delay: i * 0.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="w-2 h-2 bg-pink-500 rounded-full"
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {testResults.length === 0 && !isTesting && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">
                No social media audit run yet. Click "Run Social Audit" to start.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
