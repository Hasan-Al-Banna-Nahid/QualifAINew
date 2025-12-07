"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheck,
  FiX,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiFilter,
  FiMoreVertical,
  FiLayers,
  FiDownload,
  FiUpload
} from "react-icons/fi";
import { cn } from "@/lib/utils";
import { Requirement, RequirementStatus, RequirementPriority, RequirementCategory } from "@/app/types/requirement";

// --- Mock Data ---
const MOCK_REQUIREMENTS: Requirement[] = [
  {
    id: "1",
    projectId: "proj_1",
    description: "The website must load within 2 seconds on 4G networks.",
    category: "non-functional",
    priority: "high",
    status: "pending",
    source: "SOW_v1.pdf",
    createdAt: "2023-10-26T10:00:00Z",
  },
  {
    id: "2",
    projectId: "proj_1",
    description: "Users should be able to filter products by price range.",
    category: "functional",
    priority: "medium",
    status: "approved",
    source: "SOW_v1.pdf",
    createdAt: "2023-10-26T10:05:00Z",
  },
  {
    id: "3",
    projectId: "proj_1",
    description: "The primary color scheme should match the brand guidelines (Blue #0056b3).",
    category: "design",
    priority: "high",
    status: "pending",
    source: "Brand_Guidelines.pdf",
    createdAt: "2023-10-26T10:10:00Z",
  },
  {
    id: "4",
    projectId: "proj_1",
    description: "All images must have alt text for accessibility.",
    category: "non-functional",
    priority: "medium",
    status: "rejected",
    source: "Accessibility_Checklist.docx",
    createdAt: "2023-10-26T10:15:00Z",
  },
];

export default function RequirementsPage() {
  const [requirements, setRequirements] = useState<Requirement[]>(MOCK_REQUIREMENTS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<RequirementStatus | 'all'>('all');
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  // --- Actions ---

  const handleStatusChange = (id: string, newStatus: RequirementStatus) => {
    setRequirements((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
    );
  };

  const handleDelete = (id: string) => {
    setRequirements((prev) => prev.filter((req) => req.id !== id));
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleEditStart = (req: Requirement) => {
    setIsEditing(req.id);
    setEditValue(req.description);
  };

  const handleEditSave = (id: string) => {
    setRequirements((prev) =>
      prev.map((req) => (req.id === id ? { ...req, description: editValue } : req))
    );
    setIsEditing(null);
  };

  const handleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleMerge = () => {
    if (selectedIds.size < 2) return;

    const selectedReqs = requirements.filter((req) => selectedIds.has(req.id));
    const mergedDescription = selectedReqs.map((req) => req.description).join(" ");
    
    // Create new merged requirement
    const newReq: Requirement = {
      ...selectedReqs[0],
      id: Math.random().toString(36).substr(2, 9),
      description: mergedDescription,
      status: 'pending', // Reset status for merged item
    };

    // Remove old ones and add new one
    setRequirements((prev) => [
      newReq,
      ...prev.filter((req) => !selectedIds.has(req.id)),
    ]);
    setSelectedIds(new Set());
  };

  const filteredRequirements = requirements.filter(
    (req) => filterStatus === 'all' || req.status === filterStatus
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Requirements Review
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Review, edit, and approve extracted project requirements.
            </p>
          </div>
          <div className="flex gap-3">
             <button className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors shadow-sm">
              <FiUpload className="w-4 h-4 mr-2" />
              Import
            </button>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/30">
              <FiPlus className="w-4 h-4 mr-2" />
              Add Manual
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-lg mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg p-1">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm font-medium transition-all capitalize",
                    filterStatus === status
                      ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {filteredRequirements.length} requirements
            </div>
          </div>

          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-200">
              <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                {selectedIds.size} selected
              </span>
              <button
                onClick={handleMerge}
                disabled={selectedIds.size < 2}
                className="flex items-center px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FiLayers className="w-4 h-4 mr-1.5" />
                Merge
              </button>
              <button
                onClick={() => {
                    // Bulk delete logic
                    setRequirements(prev => prev.filter(req => !selectedIds.has(req.id)));
                    setSelectedIds(new Set());
                }}
                className="flex items-center px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
              >
                <FiTrash2 className="w-4 h-4 mr-1.5" />
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Requirements List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredRequirements.map((req) => (
              <motion.div
                key={req.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  "group bg-white dark:bg-gray-800 rounded-xl p-5 border transition-all hover:shadow-md",
                  selectedIds.has(req.id)
                    ? "border-blue-500 ring-1 ring-blue-500 bg-blue-50/30 dark:bg-blue-900/10"
                    : "border-gray-200 dark:border-gray-700"
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <div className="pt-1">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(req.id)}
                      onChange={() => handleSelection(req.id)}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider",
                        req.category === 'functional' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" :
                        req.category === 'non-functional' ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" :
                        req.category === 'design' ? "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300" :
                        "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                      )}>
                        {req.category}
                      </span>
                      <span className={cn(
                        "px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider",
                        req.priority === 'high' ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" :
                        req.priority === 'medium' ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300" :
                        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      )}>
                        {req.priority}
                      </span>
                      {req.source && (
                        <span className="text-xs text-gray-400 flex items-center">
                          <FiDownload className="w-3 h-3 mr-1" />
                          {req.source}
                        </span>
                      )}
                    </div>

                    {isEditing === req.id ? (
                      <div className="flex gap-2">
                        <textarea
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                          rows={2}
                          autoFocus
                        />
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleEditSave(req.id)}
                            className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                          >
                            <FiCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setIsEditing(null)}
                            className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
                        {req.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {req.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(req.id, 'approved')}
                          className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                          title="Approve"
                        >
                          <FiCheck className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleStatusChange(req.id, 'rejected')}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Reject"
                        >
                          <FiX className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    {req.status === 'approved' && (
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-bold flex items-center">
                            <FiCheck className="w-3 h-3 mr-1" /> Approved
                        </span>
                    )}
                    {req.status === 'rejected' && (
                        <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-xs font-bold flex items-center">
                            <FiX className="w-3 h-3 mr-1" /> Rejected
                        </span>
                    )}

                    <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />
                    
                    <button
                      onClick={() => handleEditStart(req)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(req.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredRequirements.length === 0 && (
            <div className="text-center py-12 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">No requirements found matching the filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
