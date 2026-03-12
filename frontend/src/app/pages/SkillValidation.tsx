import { useState, useEffect } from "react";
import { Breadcrumb } from "../components/Breadcrumb";
import { SkillBadge } from "../components/SkillBadge";
import { CheckCircle, XCircle, FileText } from "lucide-react";
import type { ProficiencyLevel } from "../data/mockData";
import { useDataStore } from "../store/dataStore";
import React from "react";

export function SkillValidation() {
  const validationRequests = useDataStore(s => s.validationRequests);
  const approveRequest = useDataStore(s => s.approveRequest);
  const rejectRequest = useDataStore(s => s.rejectRequest);

  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [adjustedLevel, setAdjustedLevel] = useState<ProficiencyLevel>("Beginner");

  const selectedRequest = selectedRequestId
    ? validationRequests.find(r => r.id === selectedRequestId) ?? validationRequests[0] ?? null
    : validationRequests[0] ?? null;

  useEffect(() => {
    if (validationRequests.length > 0) {
      if (!selectedRequestId || !validationRequests.some(r => r.id === selectedRequestId)) {
        setSelectedRequestId(validationRequests[0].id);
        setAdjustedLevel(validationRequests[0].requestedProficiency);
        setFeedback("");
      }
    } else {
      setSelectedRequestId(null);
      setFeedback("");
    }
  }, [validationRequests, selectedRequestId]);

  useEffect(() => {
    if (selectedRequest) {
      setAdjustedLevel(selectedRequest.requestedProficiency);
    }
  }, [selectedRequest?.id]);

  const handleApprove = () => {
    if (!selectedRequest) return;
    approveRequest(selectedRequest.id, adjustedLevel, feedback);
    setFeedback("");
    const next = validationRequests.filter(r => r.id !== selectedRequest.id);
    setSelectedRequestId(next[0]?.id ?? null);
  };

  const handleReject = () => {
    if (!selectedRequest) return;
    rejectRequest(selectedRequest.id, feedback);
    setFeedback("");
    const next = validationRequests.filter(r => r.id !== selectedRequest.id);
    setSelectedRequestId(next[0]?.id ?? null);
  };

  return (
    <div className="p-8">
      <Breadcrumb items={["Skill Matrix", "Skill Validation"]} />

      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Skill Validation
        </h1>
        <p className="text-gray-600">
          Review and validate skill submissions from your team members
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Pending Validations</p>
          <p className="text-3xl font-semibold text-gray-900">{validationRequests.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Validated This Month</p>
          <p className="text-3xl font-semibold text-gray-900">42</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Average Response Time</p>
          <p className="text-3xl font-semibold text-gray-900">2.3 days</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-semibold text-gray-900">Pending Requests</h3>
          </div>
          {validationRequests.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-sm">
              No pending validation requests
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {validationRequests.map((request) => (
                <button
                  key={request.id}
                  onClick={() => {
                    setSelectedRequestId(request.id);
                    setAdjustedLevel(request.requestedProficiency);
                    setFeedback("");
                  }}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                    selectedRequest?.id === request.id ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium">
                      {request.employeeName.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {request.employeeName}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {request.skill.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{request.submittedDate}</span>
                    <SkillBadge level={request.requestedProficiency} size="sm" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200">
          {!selectedRequest ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mb-4 text-gray-300" />
              <p className="text-lg font-medium">No request selected</p>
              <p className="text-sm mt-1">Select a request from the list or add new skill validations from the team.</p>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Validation Request Details
              </h2>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-6">
                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-medium">
                  {selectedRequest.employeeName.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedRequest.employeeName}
                  </p>
                  <p className="text-sm text-gray-600">
                    Submitted on {selectedRequest.submittedDate}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-gray-700">Skill Name</label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {selectedRequest.skill.name}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Category</label>
                    <p className="text-gray-900 mt-1">{selectedRequest.skill.category}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Subcategory</label>
                    <p className="text-gray-900 mt-1">{selectedRequest.skill.subcategory}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Requested Proficiency Level
                  </label>
                  <SkillBadge level={selectedRequest.requestedProficiency} />
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                  Submitted Evidence
                </label>
                <div className="space-y-2">
                  {selectedRequest.evidence.map((evidence, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <FileText className="w-5 h-5 text-gray-600" />
                      <span className="text-sm text-gray-900 flex-1">{evidence}</span>
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Manager Decision
                </h3>

                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Adjust Proficiency Level (Optional)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {(["Beginner", "Intermediate", "Advanced", "Expert"] as ProficiencyLevel[]).map(level => (
                      <button
                        key={level}
                        onClick={() => setAdjustedLevel(level)}
                        className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                          adjustedLevel === level
                            ? "border-blue-600 bg-blue-50 text-blue-700"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                  {adjustedLevel !== selectedRequest.requestedProficiency && (
                    <p className="text-sm text-amber-600 mt-2">
                      You are adjusting the proficiency level from {selectedRequest.requestedProficiency} to {adjustedLevel}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Feedback Comments
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide feedback or comments for the employee..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleApprove}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve & Validate
                  </button>
                  <button
                    onClick={handleReject}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
