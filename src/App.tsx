import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { BuilderPage } from './pages/BuilderPage';
import { LibraryPage } from './pages/LibraryPage';
import { PromptComposerPage } from './pages/PromptComposerPage';
import { ExportPage } from './pages/ExportPage';

export function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<BuilderPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/composer" element={<PromptComposerPage />} />
          <Route path="/export" element={<ExportPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
