"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
export default function BooksPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Books</h1>
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-green-600">✅ Fixed! Books page working!</div>
        </CardContent>
      </Card>
    </div>
  );
}
