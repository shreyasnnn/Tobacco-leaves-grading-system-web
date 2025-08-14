import { DragDropUpload } from '@/components/drag&Drop';
import { useState } from 'react';
import leaf from '../assets/images/leaf.jpg';
import NavBar from '../components/navBar';

export const HomeScreen = () => {
  const [previewImage, setPreviewImage] = useState<string>(leaf); // start with default leaf image

  const handleFiles = (files: FileList) => {
    if (files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file); // create local preview URL
      setPreviewImage(imageUrl);

      // Example: Upload to Supabase Storage
      // for (let file of files) {
      //   const { data, error } = await supabase.storage
      //     .from("uploads")
      //     .upload(`folder/${file.name}`, file);
      // }
    }
  };

  return (
    <div className="mx-[10%]">
      <NavBar />
      <div className="mt-10">
        <div className="flex items-center justify-center">
          <img src={previewImage} alt="Leaf" className="rounded-2xl max-h-[400px] object-contain" />
        </div>
        <div className="flex items-center justify-center mt-10">
          <DragDropUpload onFilesSelected={handleFiles} />
        </div>
      </div>
    </div>
  );
};
