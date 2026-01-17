// components/seo-summary-dashboard.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Shield,
  Zap,
  Globe,
  Link,
  FileText,
  Image as ImageIcon,
  Search,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

interface SEOSummaryDashboardProps {
  auditData: any;
}

export function SEOSummaryDashboard({ auditData }: SEOSummaryDashboardProps) {
  const categories = [
    {
      name: "Technical SEO",
      score: 85,
      issues: auditData?.technicalData?.totalIssues || 0,
      icon: Globe,
      color: "blue",
    },
    {
      name: "On-Page SEO",
      score: 72,
      issues: auditData?.technicalData?.titleTags?.totalIssues || 0,
      icon: FileText,
      color: "green",
    },
    {
      name: "Performance",
      score: 91,
      issues: auditData?.performance?.totalIssues || 0,
      icon: Zap,
      color: "purple",
    },
    {
      name: "Security",
      score: 88,
      issues: auditData?.security?.totalIssues || 0,
      icon: Shield,
      color: "red",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div></div>
              <div className="text-right">
                <div className="text-4xl font-bold text-white">
                  {auditData?.overallScore || 0}/100
                </div>
                <Badge
                  className={
                    (auditData?.overallScore || 0) >= 80
                      ? "bg-green-500"
                      : (auditData?.overallScore || 0) >= 60
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }
                >
                  {(auditData?.overallScore || 0) >= 80
                    ? "Excellent"
                    : (auditData?.overallScore || 0) >= 60
                    ? "Good"
                    : "Needs Improvement"}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={auditData?.overallScore || 0} className="h-3" />

              <div className="grid grid-cols-4 gap-4">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * (index + 1) }}
                  >
                    <Card className="bg-gray-900/50 border-gray-800">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <category.icon
                            className={`h-5 w-5 text-${category.color}-400`}
                          />
                          <span className="text-sm text-gray-400">
                            {category.score}%
                          </span>
                        </div>
                        <h4 className="font-semibold text-white">
                          {category.name}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {category.issues} issues
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Traffic & Authority */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Estimated Traffic
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Organic Monthly</span>
                  <span className="font-semibold">45.2K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Paid Monthly</span>
                  <span className="font-semibold">12.8K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Keywords</span>
                  <span className="font-semibold">3,456</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Link className="h-4 w-4" />
                Backlink Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total Backlinks</span>
                  <span className="font-semibold">12,345</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Referring Domains</span>
                  <span className="font-semibold">890</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Domain Authority</span>
                  <span className="font-semibold">68</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Social Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Social Shares</span>
                  <span className="font-semibold">8,901</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Engagement Rate</span>
                  <span className="font-semibold">4.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Platforms</span>
                  <span className="font-semibold">4</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Issues Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Issues Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {auditData?.summary?.errors || 0}
                </div>
                <div className="text-sm text-red-800">Critical Errors</div>
              </div>

              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {auditData?.summary?.warnings || 0}
                </div>
                <div className="text-sm text-yellow-800">Warnings</div>
              </div>

              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {auditData?.summary?.notices || 0}
                </div>
                <div className="text-sm text-blue-800">Notices</div>
              </div>

              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {auditData?.summary?.crawledPages || 0}
                </div>
                <div className="text-sm text-green-800">Pages Crawled</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
