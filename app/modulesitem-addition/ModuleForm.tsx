'use client';

import { useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

interface Chapter {
  name: string;
  slug: string;
}

interface ModuleData {
  title: string;
  description: string;
  slug: string;
  image: string;
  chapters: Chapter[];
}

export default function ModuleForm() {
  const [formData, setFormData] = useState<ModuleData>({
    title: '',
    description: '',
    slug: '',
    image: '',
    chapters: []
  });

  const [errors, setErrors] = useState<Partial<ModuleData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: Partial<ModuleData> = {};

    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.slug) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }
    if (!formData.image) {
      newErrors.image = 'Image URL is required';
    } else if (!/^https:\/\/.+/.test(formData.image)) {
      newErrors.image = 'Image URL must start with https://';
    }
    if (formData.chapters.length === 0) {
      newErrors.chapters = 'At least one chapter is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    if (validateForm()) {
      try {
        const moduleKey = formData.slug;
        const moduleData = {
          [moduleKey]: {
            ...formData
          }
        };

        // Save to localStorage for backup
        localStorage.setItem('moduleData', JSON.stringify(moduleData));

        // Save to server
        const response = await fetch('/api/modules', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(moduleData),
        });

        if (!response.ok) {
          throw new Error('Failed to save module');
        }

        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 3000);

        // Reset form
        setFormData({
          title: '',
          description: '',
          slug: '',
          image: '',
          chapters: []
        });
      } catch (error) {
        console.error('Error saving data:', error);
        setSubmitError('Failed to save module. Please try again.');
      }
    }
    setIsSubmitting(false);
  };

  const addChapter = () => {
    setFormData(prev => ({
      ...prev,
      chapters: [...prev.chapters, { name: '', slug: '' }]
    }));
  };

  const removeChapter = (index: number) => {
    setFormData(prev => ({
      ...prev,
      chapters: prev.chapters.filter((_, i) => i !== index)
    }));
  };

  const updateChapter = (index: number, field: keyof Chapter, value: string) => {
    setFormData(prev => ({
      ...prev,
      chapters: prev.chapters.map((chapter, i) => {
        if (i === index) {
          return {
            ...chapter,
            [field]: field === 'slug' ? value.toLowerCase().replace(/[^a-z0-9-]/g, '-') : value
          };
        }
        return chapter;
      })
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="card p-8 space-y-6">
      {submitSuccess && (
        <div className="bg-green-50 text-green-800 rounded-lg p-4 mb-6">
          Module has been successfully saved!
        </div>
      )}

      {submitError && (
        <div className="bg-red-50 text-red-800 rounded-lg p-4 mb-6">
          {submitError}
        </div>
      )}

      <div>
        <label className="form-label">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="form-input"
          placeholder="Enter module title"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>

      <div>
        <label className="form-label">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="form-input"
          placeholder="Enter module description"
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>

      <div>
        <label className="form-label">Slug/URL</label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') 
          }))}
          className="form-input"
          placeholder="enter-slug-here"
        />
        {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
      </div>

      <div>
        <label className="form-label">Image URL</label>
        <input
          type="url"
          value={formData.image}
          onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
          className="form-input"
          placeholder="https://example.com/image.jpg"
        />
        {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="form-label mb-0">Chapters</label>
          <button
            type="button"
            onClick={addChapter}
            className="btn-secondary inline-flex items-center"
          >
            <FiPlus className="mr-2" /> Add Chapter
          </button>
        </div>
        
        <div className="space-y-4">
          {formData.chapters.map((chapter, index) => (
            <div key={index} className="flex gap-4 items-start p-4 rounded-lg bg-gray-50">
              <div className="flex-1 space-y-3">
                <div>
                  <label className="form-label text-xs">Chapter Name</label>
                  <input
                    type="text"
                    placeholder="Enter chapter name"
                    value={chapter.name}
                    onChange={(e) => updateChapter(index, 'name', e.target.value)}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label text-xs">Chapter Slug</label>
                  <input
                    type="text"
                    placeholder="chapter-slug"
                    value={chapter.slug}
                    onChange={(e) => updateChapter(index, 'slug', e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeChapter(index)}
                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg
                transition-colors duration-200"
                title="Remove chapter"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
        {errors.chapters && <p className="mt-1 text-sm text-red-600">{errors.chapters}</p>}
      </div>

      <div className="pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full flex justify-center items-center"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            'Submit'
          )}
        </button>
      </div>
    </form>
  );
}