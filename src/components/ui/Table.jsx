import React from "react";

export function Table({ children, className }) {
  return (
    <table className={`w-full border-collapse ${className}`}>
      {children}
    </table>
  );
}

export function TableHeader({ children, className }) {
  return (
    <thead className={`bg-gray-100 ${className}`}>
      {children}
    </thead>
  );
}

export function TableRow({ children, className }) {
  return (
    <tr className={`border-b last:border-b-0 ${className}`}>
      {children}
    </tr>
  );
}

export function TableHead({ children, className }) {
  return (
    <th className={`text-left py-2 px-4 font-semibold ${className}`}>
      {children}
    </th>
  );
}

export function TableBody({ children, className }) {
  return <tbody className={className}>{children}</tbody>;
}

export function TableCell({ children, className }) {
  return <td className={`py-2 px-4 ${className}`}>{children}</td>;
}
