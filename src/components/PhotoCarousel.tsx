import type { Photo } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Plus, X } from 'lucide-react';

interface PhotoCarouselProps {
  photos: Photo[];
  isEditing: boolean;
  onUpdate: (photos: Photo[]) => void;
}

export function PhotoCarousel({ photos, isEditing, onUpdate }: PhotoCarouselProps) {

  const updatePhotos = (updater: (prev: Photo[]) => Photo[]) => {
    onUpdate(updater([...photos]));
  };

  const addPhoto = () => {
    const newPhoto: Photo = {
      id: Date.now().toString(),
      image_url: '',
      caption: '',
      sort: photos.length,
    };
    updatePhotos((prev) => [...prev, newPhoto]);
  };

  const removePhoto = (id: string) => {
    updatePhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePhoto = (id: string, updates: Partial<Photo>) => {
    updatePhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  if (isEditing) {
    return (
      <div className="space-y-4">
        {photos.map((photo) => (
          <div key={photo.id} className="space-y-3 border border-gray-200 bg-white p-4 rounded-none">
            <div className="flex items-center justify-between">
              <span className="text-xs font-sans uppercase tracking-widest text-gray-600">Photo</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removePhoto(photo.id)}
                className="h-6 w-6 p-0 text-gray-600 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Input
              value={photo.image_url}
              onChange={(e) => updatePhoto(photo.id, { image_url: e.target.value })}
              placeholder="Image URL"
              className="text-sm font-medium bg-white border-gray-200 text-gray-900"
            />
            <Textarea
              value={photo.caption}
              onChange={(e) => updatePhoto(photo.id, { caption: e.target.value })}
              placeholder="Caption (optional)"
              className="min-h-[60px] text-sm font-medium bg-white border-gray-200 text-gray-900"
            />
            {photo.image_url && (
              <div className="mt-2 overflow-hidden bg-white border border-gray-200 rounded-none relative" style={{ aspectRatio: '16/9', maxHeight: '120px' }}>
                <img
                  src={photo.image_url}
                  alt={photo.caption || 'Photo'}
                  className="h-full w-full object-cover rounded-none"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        ))}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={addPhoto} 
          className="w-full border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add photo
        </Button>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="flex items-center justify-center border border-gray-200 bg-white h-32 rounded-none">
        <p className="text-xs font-medium text-gray-600 font-sans">No photos yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
        {photos.map((photo) => (
          <div key={photo.id} className="flex-shrink-0 w-48 border border-gray-200 p-2 bg-white">
            <div className="relative overflow-hidden bg-white mb-2 border border-gray-200 rounded-none" style={{ aspectRatio: '16/9' }}>
              <img
                src={photo.image_url}
                alt={photo.caption || 'Photo'}
                className="w-full h-full object-cover rounded-none"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            {photo.caption && (
              <p className="text-[10px] text-gray-600 font-sans leading-tight">
                {photo.caption}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
