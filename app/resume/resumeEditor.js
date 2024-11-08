'use client';
import React, { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Sparkles, Wand2, X } from 'lucide-react';

const LoadingSpinner = () => (
  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
);

const CustomAlert = ({ message, onClose }) => (
  <div className="fixed top-4 right-4 z-50 bg-white border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg flex items-center gap-2">
    <span>{message}</span>
    <button onClick={onClose} className="text-red-700 hover:text-red-900">
      <X className="h-4 w-4" />
    </button>
  </div>
);

const EnhanceButton = ({ onClick, isEnhancing }) => (
  <button
    onClick={onClick}
    disabled={isEnhancing}
    className="absolute right-14 top-2 bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-full transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {isEnhancing ? (
      <>
        <LoadingSpinner />
        <span className="text-sm">Enhancing...</span>
      </>
    ) : (
      <>
        <Sparkles className="h-4 w-4" />
        <span className="text-sm">Enhance</span>
      </>
    )}
  </button>
);

const DescriptionField = ({ value, onChange, isEnhancing, onEnhance }) => (
  <div className="relative group">
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full mb-2 p-2 border rounded min-h-[100px] resize-y focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      placeholder="Enter description..."
    />
    <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <EnhanceButton onClick={onEnhance} isEnhancing={isEnhancing} />
    </div>
  </div>
);

const ResumeEditor = ({
  formData,
  handleChange,
  handleNestedChange,
  handleAddEntry,
  handleDeleteEntry,
  handleArrayFieldChange,
  handleDescriptionChange,
  onDragEnd,
  initialData
}) => {
  const isDarkMode = false;
  const [enhancingFields, setEnhancingFields] = useState({});
  const [error, setError] = useState(null);

  const enhanceWithAI = async (section, index, currentText) => {
    if (!currentText.trim()) {
      setError('Please enter some text before enhancing.');
      setTimeout(() => setError(null), 3000);
      return;
    }

    const fieldKey = `${section}-${index}`;
    setEnhancingFields(prev => ({ ...prev, [fieldKey]: true }));

    try {
      const response = await fetch('/api/enhance-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: currentText,
          context: `This is a ${section} description for a resume.`
        }),
      });

      if (!response.ok) throw new Error('Enhancement failed');

      const data = await response.json();

const trimmedData = data.enhancedText.startsWith("Revised:") ? data.enhancedText.slice(8).trim() : data.enhancedText;

console.log(trimmedData);

      handleDescriptionChange(section, index, trimmedData);
    } catch (err) {
      setError('Failed to enhance text. Please try again.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setEnhancingFields(prev => ({ ...prev, [fieldKey]: false }));
    }
  };

  const renderSection = (section, title) => (
    <div>
      <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
        {title}
        <Sparkles className="h-4 w-4 text-purple-500" />
      </h2>
      <Droppable droppableId={`${section}Droppable`}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {formData[section] && formData[section].map((item, index) => (
              <Draggable
                key={`${section}-${index}`}
                draggableId={`${section}-${index}`}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="mb-4 p-4 bg-gray-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    {Object.keys(item).map((field) => (
                      <div key={field}>
                        {field === 'description' ? (
                          <DescriptionField
                            value={item[field]}
                            onChange={(value) => handleDescriptionChange(section, index, value)}
                            isEnhancing={enhancingFields[`${section}-${index}`]}
                            onEnhance={() => enhanceWithAI(section, index, item[field])}
                          />
                        ) : (
                          <input
                            type="text"
                            value={item[field]}
                            onChange={(e) => handleArrayFieldChange(section, index, field, e.target.value)}
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                            className="w-full mb-2 p-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => handleDeleteEntry(section, index)}
                      className="relative top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded transition-colors duration-300"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <button
        onClick={() => handleAddEntry(section)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-all duration-300 mt-2"
      >
        Add {title}
      </button>
    </div>
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="space-y-8 pb-24">
        {error && <CustomAlert message={error} onClose={() => setError(null)} />}
        <h1 className="font-bold text-2xl">Resume Builder - Editor</h1>
        <span className='bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent'
        >Powered by AI</span>
        <hr className="divide-black" />

        <div>
          <h2 className="text-xl font-bold mb-2">Personal Details</h2>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
          />
          <input
            type="text"
            name="title"
            placeholder="Professional Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
          />
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Contact Information</h2>
          {Object.keys(formData.contact).map((contactKey) => (
            <input
              key={contactKey}
              type="text"
              name={contactKey}
              placeholder={contactKey.charAt(0).toUpperCase() + contactKey.slice(1)}
              value={formData.contact[contactKey]}
              onChange={(e) => handleNestedChange('contact', contactKey, e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
          ))}
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Links</h2>
          {Object.keys(formData.links).map((linkKey) => (
            <input
              key={linkKey}
              type="text"
              name={linkKey}
              placeholder={linkKey.charAt(0).toUpperCase() + linkKey.slice(1)}
              value={formData.links[linkKey]}
              onChange={(e) => handleNestedChange('links', linkKey, e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
          ))}
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Education</h2>
          {formData.education.map((edu, index) => (
            <div key={index} className="mb-4 p-2 bg-gray-200 rounded-md relative">
              {Object.keys(edu).map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={edu[field]}
                  onChange={(e) => handleArrayFieldChange('education', index, field, e.target.value)}
                  className="w-full mb-2 p-2 border rounded"
                />
              ))}
              <button
                onClick={() => handleDeleteEntry('education', index)}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded"
              >
                Delete
              </button>
            </div>
          ))}
          <button onClick={() => handleAddEntry('education')} className="bg-blue-500 text-white p-2 rounded mt-2">
            Add Education
          </button>
        </div>

        {renderSection('experience', 'Experience')}

        <div>
          <h2 className="text-xl font-bold mb-2">Skills</h2>
          {Object.keys(formData.skills).map((contactKey) => (
            <input
              key={contactKey}
              type="text"
              name={contactKey}
              placeholder={contactKey.charAt(0).toUpperCase() + contactKey.slice(1)}
              value={formData.skills[contactKey]}
              onChange={(e) => handleNestedChange('skills', contactKey, e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
          ))}
        </div>

        {renderSection('projects', 'Projects')}

        <div>
          <h2 className="text-xl font-bold mb-2">Certifications</h2>
          {formData.certifications.map((cert, index) => (
            <div key={index} className="mb-4 p-2 bg-gray-200 rounded-md relative">
              {Object.keys(cert).map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={cert[field]}
                  onChange={(e) => handleArrayFieldChange('certifications', index, field, e.target.value)}
                  className="w-full mb-2 p-2 border rounded"
                />
              ))}
              <button
                onClick={() => handleDeleteEntry('certifications', index)}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded"
              >
                Delete
              </button>
            </div>
          ))}
          <button onClick={() => handleAddEntry('certifications')} className="bg-blue-500 text-white p-2 rounded mt-2">
            Add Certification
          </button>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Honors</h2>
          {formData.honors.map((honor, index) => (
            <div key={index} className="mb-4 p-2 bg-gray-200 rounded-md relative">
              <input
                type="text"
                placeholder="Honor Title"
                value={honor.title}
                onChange={(e) => handleArrayFieldChange('honors', index, 'title', e.target.value)}
                className="w-full mb-2 p-2 border rounded"
              />
              <button
                onClick={() => handleDeleteEntry('honors', index)}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded"
              >
                Delete
              </button>
            </div>
          ))}
          <button onClick={() => handleAddEntry('honors')} className="bg-blue-500 text-white p-2 rounded mt-2">
            Add Honor
          </button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default ResumeEditor;
