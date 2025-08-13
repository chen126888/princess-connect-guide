import React from 'react';
import Card from '../../components/Common/Card';

interface AttributeSelectorProps {
  attributes: string[];
  activeAttribute: string;
  onAttributeChange: (attribute: string) => void;
}

const attributeNames: Record<string, string> = {
  fire: '火屬',
  water: '水屬',
  wind: '風屬',
  light: '光屬',
  dark: '闇屬',
  compensationKnife: '補償刀',
};

const attributeIconNames: Record<string, string> = {
  fire: '火',
  water: '水',
  wind: '風',
  light: '光',
  dark: '闇',
};

const AttributeSelector: React.FC<AttributeSelectorProps> = ({ attributes, activeAttribute, onAttributeChange }) => {
  return (
    <Card className="mb-6">
      <div className="flex flex-wrap justify-center gap-4">
        {attributes.map((attr) => (
          <button
            key={attr}
            onClick={() => onAttributeChange(attr)}
            className={`px-6 py-3 rounded-lg text-lg font-semibold transition-colors duration-200 flex items-center gap-2 justify-center
              ${activeAttribute === attr
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
          >
            {attributeNames[attr] || attr}
            {attr !== 'compensationKnife' && ( // Only show icon for attributes, not for compensationKnife
              <img
                src={`http://localhost:3000/images/shop_icon/${attributeIconNames[attr]}.png`}
                alt={attributeNames[attr] || attr}
                className="inline-block w-6 h-6 object-contain"
              />
            )}
          </button>
        ))}
      </div>
    </Card>
  );
};

export default AttributeSelector;
