import React, { useState, useEffect } from 'react';
import { Folder, Tag, Search, Filter, Grid, List, Archive, Trash2, Download, Share2, Eye, Calendar, Star } from 'lucide-react';

const QRLibraryManager = ({ onQRSelect }) => {
  const [qrCodes, setQrCodes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('date');
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const defaultFolders = [
    { id: 'all', name: 'All QR Codes', icon: Grid, count: 0 },
    { id: 'recent', name: 'Recent', icon: Calendar, count: 0 },
    { id: 'favorites', name: 'Favorites', icon: Star, count: 0 },
    { id: 'archived', name: 'Archived', icon: Archive, count: 0 },
    { id: 'trash', name: 'Trash', icon: Trash2, count: 0 }
  ];

  const availableTags = [
    { id: 'business', name: 'Business', color: 'bg-blue-500' },
    { id: 'personal', name: 'Personal', color: 'bg-green-500' },
    { id: 'marketing', name: 'Marketing', color: 'bg-purple-500' },
    { id: 'event', name: 'Event', color: 'bg-red-500' },
    { id: 'social', name: 'Social', color: 'bg-pink-500' },
    { id: 'website', name: 'Website', color: 'bg-indigo-500' },
    { id: 'contact', name: 'Contact', color: 'bg-yellow-500' }
  ];

  useEffect(() => {
    loadQRCodes();
    loadFolders();
  }, []);

  const loadQRCodes = () => {
    // Load from localStorage or API
    const savedQRs = JSON.parse(localStorage.getItem('qr-library') || '[]');
    setQrCodes(savedQRs);
  };

  const loadFolders = () => {
    const savedFolders = JSON.parse(localStorage.getItem('qr-folders') || '[]');
    setFolders([...defaultFolders, ...savedFolders]);
  };

  const createFolder = () => {
    if (!newFolderName.trim()) return;
    
    const newFolder = {
      id: Date.now().toString(),
      name: newFolderName,
      icon: Folder,
      count: 0,
      isCustom: true
    };
    
    const updatedFolders = [...folders, newFolder];
    setFolders(updatedFolders);
    localStorage.setItem('qr-folders', JSON.stringify(updatedFolders.filter(f => f.isCustom)));
    setNewFolderName('');
    setShowCreateFolder(false);
  };

  const toggleTag = (tagId) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const addToFavorites = (qrId) => {
    setQrCodes(prev =>
      prev.map(qr =>
        qr.id === qrId ? { ...qr, isFavorite: !qr.isFavorite } : qr
      )
    );
  };

  const moveToTrash = (qrId) => {
    setQrCodes(prev =>
      prev.map(qr =>
        qr.id === qrId ? { ...qr, isDeleted: true, deletedAt: new Date() } : qr
      )
    );
  };

  const moveToFolder = (qrId, folderId) => {
    setQrCodes(prev =>
      prev.map(qr =>
        qr.id === qrId ? { ...qr, folderId } : qr
      )
    );
  };

  const filteredQRCodes = qrCodes.filter(qr => {
    // Search filter
    if (searchTerm && !qr.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !qr.url.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Folder filter
    if (selectedFolder !== 'all') {
      switch (selectedFolder) {
        case 'recent':
          return new Date(qr.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        case 'favorites':
          return qr.isFavorite;
        case 'archived':
          return qr.isArchived;
        case 'trash':
          return qr.isDeleted;
        default:
          return qr.folderId === selectedFolder;
      }
    }
    
    // Tag filter
    if (selectedTags.length > 0) {
      return selectedTags.some(tag => qr.tags?.includes(tag));
    }
    
    return !qr.isDeleted;
  });

  const QRCard = ({ qr }) => (
    <div className="group relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* QR Code Preview */}
      <div className="aspect-square bg-gray-50 dark:bg-gray-700 flex items-center justify-center p-4">
        <div className="w-full h-full bg-white rounded-lg shadow-inner flex items-center justify-center">
          <div className="w-32 h-32 bg-gray-900 rounded-lg opacity-20"></div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-gray-900 dark:text-white truncate flex-1">
            {qr.name || 'Untitled'}
          </h4>
          <button
            onClick={() => addToFavorites(qr.id)}
            className={`p-1 rounded ${qr.isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
          >
            <Star className="w-4 h-4" />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-3">
          {qr.url}
        </p>
        
        {/* Tags */}
        {qr.tags && qr.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {qr.tags.slice(0, 2).map(tagId => {
              const tag = availableTags.find(t => t.id === tagId);
              return tag ? (
                <span
                  key={tagId}
                  className={`px-2 py-1 text-xs text-white rounded-full ${tag.color}`}
                >
                  {tag.name}
                </span>
              ) : null;
            })}
            {qr.tags.length > 2 && (
              <span className="px-2 py-1 text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 rounded-full">
                +{qr.tags.length - 2}
              </span>
            )}
          </div>
        )}
        
        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <Eye className="w-3 h-3 mr-1" />
              {qr.views || 0}
            </span>
            <span className="flex items-center">
              <Download className="w-3 h-3 mr-1" />
              {qr.downloads || 0}
            </span>
          </div>
          <span>{new Date(qr.createdAt).toLocaleDateString()}</span>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onQRSelect(qr)}
            className="flex-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Open
          </button>
          <button className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            <Share2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => moveToTrash(qr.id)}
            className="p-1 text-gray-600 dark:text-gray-400 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const QRListItem = ({ qr }) => (
    <div className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
      <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <div className="w-12 h-12 bg-gray-900 rounded opacity-20"></div>
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 dark:text-white truncate">
          {qr.name || 'Untitled'}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
          {qr.url}
        </p>
        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
          <span>{new Date(qr.createdAt).toLocaleDateString()}</span>
          <span>{qr.views || 0} views</span>
          <span>{qr.downloads || 0} downloads</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => addToFavorites(qr.id)}
          className={`p-2 rounded ${qr.isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
        >
          <Star className="w-4 h-4" />
        </button>
        <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
          <Share2 className="w-4 h-4" />
        </button>
        <button 
          onClick={() => moveToTrash(qr.id)}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
      {/* Sidebar */}
      <div className="lg:col-span-1 space-y-6">
        {/* Search */}
        <div className="card">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search QR codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Folders */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900 dark:text-white">Folders</h3>
            <button
              onClick={() => setShowCreateFolder(!showCreateFolder)}
              className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <Folder className="w-4 h-4" />
            </button>
          </div>
          
          {showCreateFolder && (
            <div className="mb-4 space-y-2">
              <input
                type="text"
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <div className="flex space-x-2">
                <button
                  onClick={createFolder}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowCreateFolder(false)}
                  className="px-3 py-1 text-sm bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          <div className="space-y-1">
            {folders.map((folder) => {
              const IconComponent = folder.icon;
              return (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                    selectedFolder === folder.id
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className="w-4 h-4" />
                    <span>{folder.name}</span>
                  </div>
                  <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                    {folder.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tags */}
        <div className="card">
          <h3 className="font-medium text-gray-900 dark:text-white mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`px-3 py-1 text-xs rounded-full transition-all ${
                  selectedTags.includes(tag.id)
                    ? `${tag.color} text-white`
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3 space-y-6">
        {/* Toolbar */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                QR Library ({filteredQRCodes.length})
              </h2>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="date">Sort by Date</option>
                <option value="name">Sort by Name</option>
                <option value="views">Sort by Views</option>
                <option value="downloads">Sort by Downloads</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'text-gray-600 dark:text-gray-400'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'text-gray-600 dark:text-gray-400'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* QR Codes Grid/List */}
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
        }>
          {filteredQRCodes.length > 0 ? (
            filteredQRCodes.map((qr) => (
              viewMode === 'grid' 
                ? <QRCard key={qr.id} qr={qr} />
                : <QRListItem key={qr.id} qr={qr} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Archive className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No QR codes found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm || selectedTags.length > 0 || selectedFolder !== 'all'
                  ? 'Try adjusting your filters or search terms'
                  : 'Create your first QR code to get started'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRLibraryManager;
