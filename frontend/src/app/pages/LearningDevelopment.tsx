import { Breadcrumb } from "../components/Breadcrumb";
import { GraduationCap, BookOpen, Clock, Users, TrendingUp, Target, ArrowRight } from "lucide-react";
import { learningRecommendations } from "../data/mockData";
import React from "react";

export function LearningDevelopment() {
  return (
    <div className="p-8">
      <Breadcrumb items={["Skill Matrix", "Learning & Development"]} />

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Learning & Development
        </h1>
        <p className="text-gray-600">
          Skill gap analysis and recommended learning programs
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-red-600" />
            <p className="text-sm text-gray-600">Skill Gaps Identified</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{learningRecommendations.length}</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-gray-600">Employees Affected</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {learningRecommendations.reduce((sum, rec) => sum + rec.affectedEmployees, 0)}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600">Learning Programs</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {learningRecommendations.reduce((sum, rec) => sum + rec.courses.length, 0)}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <p className="text-sm text-gray-600">Completion Rate</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">72%</p>
        </div>
      </div>

      {/* Skill Gap Recommendations */}
      <div className="space-y-6">
        {learningRecommendations.map((recommendation) => (
          <div key={recommendation.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Skill Gap: {recommendation.skillGap}
                    </h3>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Current Level:</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-medium">
                        {recommendation.currentLevel}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">Target Level:</span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded font-medium">
                        {recommendation.targetLevel}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-gray-600" />
                    <span className="text-2xl font-semibold text-gray-900">
                      {recommendation.affectedEmployees}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Employees</p>
                </div>
              </div>
            </div>

            {/* Learning Programs */}
            <div className="p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Recommended Learning Programs</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendation.courses.map((course, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <GraduationCap className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900 mb-1">{course.name}</h5>
                        <p className="text-sm text-gray-600">{course.provider}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                      <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  Enroll Employees
                </button>
                <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  Create Learning Path
                </button>
                <button className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  View Affected Employees
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Learning Programs */}
      <div className="mt-8 bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Active Learning Programs
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">AWS Solutions Architect Training</p>
                <p className="text-sm text-gray-600">15 employees enrolled • 45% average completion</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View Progress
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Advanced React Patterns</p>
                <p className="text-sm text-gray-600">22 employees enrolled • 68% average completion</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View Progress
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Kubernetes Administration</p>
                <p className="text-sm text-gray-600">8 employees enrolled • 32% average completion</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '32%' }}></div>
                </div>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View Progress
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
