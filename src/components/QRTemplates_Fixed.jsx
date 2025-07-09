import React, { useState } from 'react';
import { Palette, Briefcase, Heart, Zap, Crown, Star } from 'lucide-react';

const QRTemplates = ({ onTemplateSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState('business');

  const templates = {
    business: {
      name: 'Business',
      icon: Briefcase,
      items: [
        {
          id: 'business-1',
          name: 'Corporate Blue',
          description: 'Professional blue design',
          options: {
            dotsOptions: { color: '#1e40af', type: 'rounded' },
            backgroundOptions: { color: '#ffffff' },
            cornersSquareOptions: { color: '#1e40af', type: 'square' },
            cornersDotOptions: { color: '#1e40af', type: 'square' }
          },
          preview: '#1e40af'
        },
        {
          id: 'business-2',
          name: 'Executive Black',
          description: 'Elegant black theme',
          options: {
            dotsOptions: { color: '#000000', type: 'square' },
            backgroundOptions: { color: '#ffffff' },
            cornersSquareOptions: { color: '#000000', type: 'square' },
            cornersDotOptions: { color: '#000000', type: 'square' }
          },
          preview: '#000000'
        },
        {
          id: 'business-3',
          name: 'Modern Green',
          description: 'Fresh green approach',
          options: {
            dotsOptions: { color: '#059669', type: 'rounded' },
            backgroundOptions: { color: '#ffffff' },
            cornersSquareOptions: { color: '#059669', type: 'extra-rounded' },
            cornersDotOptions: { color: '#059669', type: 'dot' }
          },
          preview: '#059669'
        }
      ]
    },
    creative: {
      name: 'Creative',
      icon: Palette,
      items: [
        {
          id: 'creative-1',
          name: 'Sunset Orange',
          description: 'Vibrant sunset colors',
          options: {
            dotsOptions: { color: '#ea580c', type: 'rounded' },
            backgroundOptions: { color: '#fff7ed' },
            cornersSquareOptions: { color: '#dc2626', type: 'extra-rounded' },
            cornersDotOptions: { color: '#dc2626', type: 'dot' }
          },
          preview: '#ea580c'
        },
        {
          id: 'creative-2',
          name: 'Purple Dream',
          description: 'Creative purple theme',
          options: {
            dotsOptions: { color: '#7c3aed', type: 'classy-rounded' },
            backgroundOptions: { color: '#faf5ff' },
            cornersSquareOptions: { color: '#7c3aed', type: 'extra-rounded' },
            cornersDotOptions: { color: '#7c3aed', type: 'dot' }
          },
          preview: '#7c3aed'
        }
      ]
    },
    personal: {
      name: 'Personal',
      icon: Heart,
      items: [
        {
          id: 'personal-1',
          name: 'Soft Pink',
          description: 'Gentle pink design',
          options: {
            dotsOptions: { color: '#ec4899', type: 'rounded' },
            backgroundOptions: { color: '#fdf2f8' },
            cornersSquareOptions: { color: '#ec4899', type: 'extra-rounded' },
            cornersDotOptions: { color: '#ec4899', type: 'dot' }
          },
          preview: '#ec4899'
        }
      ]
    }
  };

  const categories = Object.keys(templates);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            QR Code Templates
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Choose from professional pre-designed templates
          </p>
        </div>
        
        {/* Category Navigation */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const CategoryIcon = templates[category].icon;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <CategoryIcon className="w-4 h-4" />
                <span className="font-medium">{templates[category].name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="card">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {templates[selectedCategory].name} Templates
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Choose a pre-designed template for your QR codes
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates[selectedCategory].items.map((template) => (
            <div key={template.id} className="bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer">
              <div className="text-center">
                {/* QR Code Preview */}
                <div className="w-32 h-32 mx-auto mb-4 bg-gray-100 dark:bg-gray-600 rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-2 grid grid-cols-8 grid-rows-8 gap-px">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div
                        key={i}
                        className="rounded-sm"
                        style={{
                          backgroundColor: Math.random() > 0.3 ? template.preview : 'transparent'
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {template.name}
                </h4>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {template.description}
                </p>
                
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: template.preview }}
                  />
                  <span>{template.preview}</span>
                </div>
                
                <button 
                  onClick={() => onTemplateSelect(template)}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QRTemplates;
