import React from 'react';
import TabNavigation, { type TabItem } from '../Common/TabNavigation';

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
  const attributeItems: TabItem<string>[] = attributes.map(attr => ({
    key: attr,
    label: attributeNames[attr] || attr,
    hasImage: attr !== 'compensationKnife'
  }));

  const renderAttributeIcon = (item: TabItem<string>) => {
    if (item.hasImage && attributeIconNames[item.key]) {
      return (
        <img
          src={`${import.meta.env.VITE_IMAGE_BASE_URL }/icons/${attributeIconNames[item.key]}.png`}
          alt={item.label}
          className="w-6 h-6 object-contain"
        />
      );
    }
    return null;
  };

  return (
    <TabNavigation
      items={attributeItems}
      activeItem={activeAttribute}
      onItemChange={onAttributeChange}
      buttonSize="lg"
      layout="center"
      renderIcon={renderAttributeIcon}
      className=""
    />
  );
};

export default AttributeSelector;
