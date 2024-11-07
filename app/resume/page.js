'use client';
import React, { useState } from 'react';
import ResumeEditor from './resumeEditor';
import ResumePreview from './resumePreview';
import { DragDropContext } from 'react-beautiful-dnd';
import Navbar from '../components/Navbar/page';

const initialData = {
  experience: [
    {
      title: '',
      organisation: '',
      description: '',
      location: '',
      period: ''
    }
  ],
  projects: [
    {
      title: '',
      organisation: '',
      description: '',
      link: '',
      skills: ''
    }
  ],
  education: [
    {
      institution: '',
      degree: '',
      cgpa: '',
      location: '',
      period: ''
    }
  ],
  certifications: [
    {
      title: '',
      organisation: '',
      link: ''
    }
  ],
  honors: [
    {
      title: ''
    }
  ]
};

const ResumeBuilder = () => {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    contact: {
      email: '',
      phone: '',
      address: ''
    },
    links: {
      codechef: '',
      linkedin: '',
      leetcode: '',
      github: '',
      portfolio: ''
    },
    education: initialData.education,
    experience: initialData.experience,
    skills: {
      programmingLanguages: "",
      frameworks: "",
      tools: "",
      databases: ""
    },
    projects: initialData.projects,
    certifications: initialData.certifications,
    honors: initialData.honors
  });

  const isDarkMode = false;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value,
      },
    }));
  };

  const handleAddEntry = (section) => {
    const newEntry = {
      experience: { title: '', organisation: '', description: '', location: '', period: '' },
      projects: { title: '', organisation: '', description: '', link: '', skills: '' },
      education: { institution: '', degree: '', cgpa: '', location: '', period: '' },
      certifications: { title: '', organisation: '', link: '' },
      honors: { title: '' }
    };
    setFormData((prevData) => ({
      ...prevData,
      [section]: [...prevData[section], newEntry[section]]
    }));
  };

  const handleDeleteEntry = (section, index) => {
    const updatedSection = formData[section].filter((_, i) => i !== index);
    setFormData((prevData) => ({
      ...prevData,
      [section]: updatedSection
    }));
  };

  const handleArrayFieldChange = (section, index, field, value) => {
    const updatedSection = formData[section].map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setFormData((prevData) => ({
      ...prevData,
      [section]: updatedSection,
    }));
  };

  const handleDescriptionChange = (section, index, value) => {
    const updatedSection = formData[section].map((item, i) =>
      i === index ? { ...item, description: value } : item
    );
    setFormData((prevData) => ({
      ...prevData,
      [section]: updatedSection,
    }));
  };

  const onDragEnd = (result) => {
    const { source, destination, type } = result;

    if (!destination) return;

    const items = Array.from(formData[type]);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);

    setFormData((prevData) => ({
      ...prevData,
      [type]: items,
    }));
  };

  return (
    <>
      <div className="flex relative top-[60px] h-screen">
        <div className={`w-1/4 p-4 overflow-y-scroll no-scrollbar ${isDarkMode ? "bg-black text-white" : "bg-gray-100 text-black"}`}>
          <Navbar />
          <DragDropContext onDragEnd={onDragEnd}>
            <ResumeEditor
              formData={formData}
              handleChange={handleChange}
              handleNestedChange={handleNestedChange}
              handleAddEntry={handleAddEntry}
              handleDeleteEntry={handleDeleteEntry}
              handleArrayFieldChange={handleArrayFieldChange}
              handleDescriptionChange={handleDescriptionChange}
              onDragEnd={onDragEnd}
              initialData={initialData}
            />
          </DragDropContext>
        </div>
        <div className="w-3/4 bg-gray-200 overflow-y-scroll p-5 no-scrollbar text-black">
          <ResumePreview resume={formData} />
        </div>
      </div>
    </>
  );
};

export default ResumeBuilder;
