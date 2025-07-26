import React from 'react';
import { PackagePlus } from 'lucide-react';
import { RawMaterial } from './types'; // 🔁 adjust path if needed

interface RawMaterialsProps {
  materials: RawMaterial[];
  onOrderMore?: () => void;
}

const RawMaterials: React.FC<RawMaterialsProps> = ({ materials, onOrderMore }) => {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-indigo-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
          <PackagePlus className="w-5 h-5 mr-2 text-indigo-600" />
          Raw Materials
        </h3>
        {onOrderMore && (
          <button
            onClick={onOrderMore}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition"
          >
            Order More
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-indigo-100">
              <th className="text-left py-3 px-4 font-medium text-gray-600">Image</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Material</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Quantity</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Unit</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((material) => (
              <tr key={material.id} className="border-b border-indigo-50 hover:bg-indigo-50/50 transition-colors">
                <td className="py-3 px-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                    {material.image ? (
                      <img 
                        src={material.image} 
                        alt={material.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
                        <PackagePlus className="w-6 h-6 text-indigo-600" />
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-800">{material.name}</td>
                <td className="py-3 px-4 text-gray-800">{material.quantity}</td>
                <td className="py-3 px-4 text-gray-800">{material.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RawMaterials;
