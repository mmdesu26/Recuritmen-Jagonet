"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle, CheckCircle2, AlertTriangle, Info } from "lucide-react";

type AlertType = "success" | "error" | "warning" | "info";

interface AlertProps {
  show: boolean;
  type?: AlertType;
  message: string;
  onClose?: () => void;
}

const iconMap = {
  success: <CheckCircle2 className="w-5 h-5 text-green-600" />,
  error: <XCircle className="w-5 h-5 text-red-600" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
  info: <Info className="w-5 h-5 text-blue-600" />,
};

const bgColorMap = {
  success: "bg-green-50 border-green-500 text-green-700",
  error: "bg-red-50 border-red-500 text-red-700",
  warning: "bg-yellow-50 border-yellow-500 text-yellow-700",
  info: "bg-blue-50 border-blue-500 text-blue-700",
};

const Alert: React.FC<AlertProps> = ({ show, type = "info", message, onClose }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2 }}
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 border-l-4 p-4 rounded-lg shadow-md ${bgColorMap[type]}`}
        >
          {iconMap[type]}
          <span className="text-sm font-medium">{message}</span>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-3 text-sm font-bold opacity-60 hover:opacity-100"
            >
              ×
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Alert;
