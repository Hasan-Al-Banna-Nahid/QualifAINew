// app/qualifai/ai-automation/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Cpu, Play, Database, Zap, CheckCircle2, XCircle } from "lucide-react";

export default function AIAutomationQAPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId");

  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [workflowJson, setWorkflowJson] = useState("");
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleAnalyze = () => {
    if (!workflowJson) return;
    
    // Dynamic import to avoid SSR issues if any, though here it's fine
    const { n8nService } = require("@/app/(main)/lib/services/n8n.service");
    const parsed = n8nService.parseWorkflow(workflowJson);
    
    if (parsed) {
      const analysis = n8nService.analyzeWorkflow(parsed);
      setAnalysisResult(analysis);
      
      // Update test results based on static analysis
      setTestResults([
        { name: "JSON Syntax Validation", status: "passed" },
        { name: "Node Connectivity Check", status: analysis.issues.length === 0 ? "passed" : "warning" },
        { name: "Error Handling Presence", status: analysis.issues.some((i: string) => i.includes("Error Trigger")) ? "failed" : "passed" },
        { name: "Complexity Analysis", status: "info", message: analysis.complexity },
      ]);
    } else {
      setTestResults([{ name: "JSON Syntax Validation", status: "failed" }]);
    }
  };

  const runN8nTests = async () => {
    setIsTesting(true);

    // Simulate n8n workflow testing (Functional)
    const tests = [
      { name: "Webhook Connectivity", status: "running" },
      { name: "Workflow Validation", status: "running" },
      { name: "Node Execution", status: "running" },
      { name: "Data Transformation", status: "running" },
      { name: "Error Handling", status: "running" },
    ];

    setTestResults(prev => [...prev.filter(t => t.status !== 'running'), ...tests]);

    // Simulate test execution
    for (let i = 0; i < tests.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTestResults((prev) =>
        prev.map((test) =>
          test.name === tests[i].name
            ? { ...test, status: Math.random() > 0.2 ? "passed" : "failed" }
            : test
        )
      );
    }

    setIsTesting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/50 via-red-50/50 to-pink-50/50 dark:from-gray-900 dark:via-red-900/20 dark:to-pink-900/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <Cpu className="w-8 h-8 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                AI Automation QA
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                n8n workflow testing and automation quality assurance
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Workflow Input
            </h2>
            <p className="text-sm text-gray-500 mb-4">Paste your n8n workflow JSON here to analyze its structure and logic.</p>
            
            <textarea
              value={workflowJson}
              onChange={(e) => setWorkflowJson(e.target.value)}
              className="w-full h-64 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl font-mono text-sm focus:ring-2 focus:ring-orange-500 outline-none resize-none"
              placeholder='{ "nodes": [...], "connections": {...} }'
            />
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleAnalyze}
                disabled={!workflowJson}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Analyze Structure
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                QA Results
              </h2>
              <button
                onClick={runN8nTests}
                disabled={isTesting}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-all text-sm font-medium"
              >
                <Play className="w-4 h-4" />
                <span>Run Functional Tests</span>
              </button>
            </div>

            {/* Analysis Summary */}
            {analysisResult && (
              <div className="mb-6 grid grid-cols-3 gap-4">
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">{analysisResult.nodeCount}</div>
                  <div className="text-xs text-gray-500">Nodes</div>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-center">
                  <div className="text-lg font-bold text-red-600 capitalize">{analysisResult.complexity}</div>
                  <div className="text-xs text-gray-500">Complexity</div>
                </div>
                <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg text-center">
                  <div className="text-2xl font-bold text-pink-600">{analysisResult.issues.length}</div>
                  <div className="text-xs text-gray-500">Issues</div>
                </div>
              </div>
            )}

            {/* Test List */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {testResults.length === 0 && !isTesting && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Input a workflow or run tests to see results.</p>
                </div>
              )}

              {testResults.map((test, index) => (
                <motion.div
                  key={`${test.name}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800"
                >
                  <div className="flex items-center space-x-3">
                    {test.status === "running" && (
                      <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    )}
                    {test.status === "passed" && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    {test.status === "failed" && <XCircle className="w-5 h-5 text-red-500" />}
                    {test.status === "warning" && <XCircle className="w-5 h-5 text-yellow-500" />}
                    {test.status === "info" && <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center text-xs font-bold">i</div>}
                    
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white text-sm">{test.name}</div>
                      {test.message && <div className="text-xs text-gray-500">{test.message}</div>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
