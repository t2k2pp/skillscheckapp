
import React, { useState } from 'react';
import { IndexScreen } from './components/IndexScreen';
import { EditorScreen } from './components/EditorScreen'; // This will be created next

type View = 'list' | 'edit';

const App: React.FC = () => {
  const [view, setView] = useState<View>('list');
  const [currentFile, setCurrentFile] = useState<string | null>(null);

  const handleEdit = (filename: string) => {
    setCurrentFile(filename);
    setView('edit');
  };

  const handleBack = () => {
    setCurrentFile(null);
    setView('list');
  };

  return (
    <div>
      {view === 'list' ? (
        <IndexScreen onEdit={handleEdit} />
      ) : (
        <EditorScreen filename={currentFile!} onBack={handleBack} />
      )}
    </div>
  );
};

export default App;
