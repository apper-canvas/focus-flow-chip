import React from "react";
import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="animate-fade-in space-y-4">
      {/* Task input form skeleton */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="h-4 bg-slate-200 rounded mb-2 w-16 animate-pulse"></div>
            <div className="h-10 bg-slate-200 rounded animate-pulse"></div>
          </div>
          <div>
            <div className="h-4 bg-slate-200 rounded mb-2 w-20 animate-pulse"></div>
            <div className="h-10 bg-slate-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="mb-4">
          <div className="h-4 bg-slate-200 rounded mb-2 w-24 animate-pulse"></div>
          <div className="h-24 bg-slate-200 rounded animate-pulse"></div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="h-4 bg-slate-200 rounded mb-2 w-16 animate-pulse"></div>
            <div className="h-10 bg-slate-200 rounded animate-pulse"></div>
          </div>
          <div className="flex-1">
            <div className="h-4 bg-slate-200 rounded mb-2 w-14 animate-pulse"></div>
            <div className="h-10 bg-slate-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="h-10 bg-slate-200 rounded animate-pulse"></div>
      </div>

      {/* Task list skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-5 h-5 bg-slate-200 rounded animate-pulse mt-0.5"></div>
                <div className="flex-1">
                  <div className="h-5 bg-slate-200 rounded mb-2 w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <div className="w-16 h-6 bg-slate-200 rounded-full animate-pulse"></div>
                <div className="w-8 h-8 bg-slate-200 rounded animate-pulse"></div>
                <div className="w-8 h-8 bg-slate-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="h-4 bg-slate-200 rounded w-20 animate-pulse"></div>
              <div className="h-4 bg-slate-200 rounded w-24 animate-pulse"></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Loading;