/**
 * السبع المثاني — Application Root Component
 * Architectural Specification: Modular Monolith + Clean Architecture
 */

import React, { useState } from 'react';
import { AuthProvider } from './core/auth/AuthContext';
import { Header } from './components/Header';
import { TreeViewer } from './features/trees/TreeViewer';
import { PersonListView } from './features/persons/PersonListView';
import { SourcesView } from './features/sources/SourcesView';
import { ContributionsView } from './features/contributions/ContributionsView';
import { AboutView } from './features/about/AboutView';
import { AdminDashboardView } from './features/admin/AdminDashboardView';
import { AtlasView } from './features/atlas/AtlasView';
import { PersonProfileModal } from './features/persons/PersonProfileModal';
import { AuthModal } from './features/auth/AuthModal';

function MainApp() {
  const [currentTab, setCurrentTab] = useState<'trees' | 'persons' | 'atlas' | 'sources' | 'contributions' | 'about' | 'admin'>('trees');
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [focusPersonIdInTree, setFocusPersonIdInTree] = useState<string | null>(null);
  const [selectedPlaceIdInAtlas, setSelectedPlaceIdInAtlas] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleOpenPerson = (personIdOrSlug: string) => {
    setSelectedPersonId(personIdOrSlug);
  };

  const handleClosePerson = () => {
    setSelectedPersonId(null);
  };

  const handleOpenInTree = (personId?: string) => {
    setSelectedPersonId(null);
    if (personId) {
      setFocusPersonIdInTree(personId);
    }
    setCurrentTab('trees');
  };

  const handleOpenPlace = (placeId: string) => {
    setSelectedPersonId(null);
    setSelectedPlaceIdInAtlas(placeId);
    setCurrentTab('atlas');
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-950">
      
      {/* Top Main Navigation Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onSelectPerson={handleOpenPerson}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col">
        {currentTab === 'trees' && (
          <TreeViewer 
            onOpenPerson={handleOpenPerson} 
            initialFocusPersonId={focusPersonIdInTree}
          />
        )}

        {currentTab === 'persons' && (
          <PersonListView 
            onOpenPerson={handleOpenPerson}
            onOpenTree={handleOpenInTree}
          />
        )}

        {currentTab === 'atlas' && (
          <AtlasView
            onOpenPerson={handleOpenPerson}
            onOpenTree={handleOpenInTree}
            initialSelectedPlaceId={selectedPlaceIdInAtlas}
          />
        )}

        {currentTab === 'sources' && (
          <SourcesView />
        )}

        {currentTab === 'contributions' && (
          <ContributionsView />
        )}

        {currentTab === 'admin' && (
          <AdminDashboardView onOpenPerson={handleOpenPerson} />
        )}

        {currentTab === 'about' && (
          <AboutView />
        )}
      </main>

      {/* Person Detail & Sources Modal */}
      {selectedPersonId && (
        <PersonProfileModal
          personIdOrSlug={selectedPersonId}
          onClose={handleClosePerson}
          onSelectPerson={handleOpenPerson}
          onOpenInTree={handleOpenInTree}
          onOpenPlace={handleOpenPlace}
        />
      )}

      {/* Researcher Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

