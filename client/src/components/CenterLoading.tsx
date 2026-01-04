import { Loader2 } from 'lucide-react';
import React from 'react'

const CenterLoading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-12 h-12 animate-spin text-(--primary)" />
    </div>
  );
}

export default CenterLoading
