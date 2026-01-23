import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 sm:p-6 lg:p-8">
      {children}
    </div>
  );
};

export default AuthLayout;
