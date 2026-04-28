import React, { useState, useEffect } from 'react';

const FileScanner = ({ user }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileHash, setFileHash] = useState('');
  const [hashAlgorithm, setHashAlgorithm] = useState('sha256');
  const [storedHash, setStoredHash] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedFiles, setSavedFiles] = useState([]);
  const [editingFile, setEditingFile] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [folders, setFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editingFolderName, setEditingFolderName] = useState('');
  const [fileToMove, setFileToMove] = useState(null);
  const [moveTargetFolderId, setMoveTargetFolderId] = useState('');
  
  useEffect(() => {
    loadFolders();
    loadSavedFiles();
  }, []);

  const loadSavedFiles = () => {
    let files = JSON.parse(localStorage.getItem('sharedFiles') || '[]');
    files = files.map((fileData) => {
      if (fileData.isText === undefined) {
        fileData.isText = fileData.type && fileData.type.startsWith('text/') || ['txt', 'js', 'json', 'html', 'css', 'md', 'py', 'java', 'c', 'cpp', 'xml', 'svg'].includes(fileData.filename.split('.').pop().toLowerCase());
      }
      if (!fileData.folderId) {
        fileData.folderId = 'root';
      }
      return fileData;
    });
    setSavedFiles(files);
  };

  const loadFolders = () => {
    let savedFolders = JSON.parse(localStorage.getItem('folders') || '[]');
    if (savedFolders.length === 0) {
      savedFolders = [{
        id: 'root',
        name: 'General',
        createdBy: user.username,
        date: new Date().toISOString()
      }];
      localStorage.setItem('folders', JSON.stringify(savedFolders));
    }
    setFolders(savedFolders);
    if (!selectedFolderId && savedFolders.length > 0) {
      setSelectedFolderId(savedFolders[0].id);
    }
  };

  const canEditFolder = (folder) => {
    return user.role === 'admin' || folder.createdBy === user.username;
  };

  const createFolder = () => {
    if (!newFolderName.trim()) {
      setError('Please enter a folder name');
      return;
    }

    const savedFolders = JSON.parse(localStorage.getItem('folders') || '[]');
    const newFolder = {
      id: Date.now().toString(),
      name: newFolderName.trim(),
      createdBy: user.username,
      date: new Date().toISOString()
    };
    savedFolders.push(newFolder);
    localStorage.setItem('folders', JSON.stringify(savedFolders));
    setNewFolderName('');
    loadFolders();
    const alerts = JSON.parse(localStorage.getItem('alerts') || '[]');
    alerts.push({
      username: user.username,
      file: newFolder.name,
      action: 'folder_created',
      risk: 'normal',
      date: new Date().toISOString()
    });
    localStorage.setItem('alerts', JSON.stringify(alerts));
    setResult({
      status: 'success',
      message: `Folder "${newFolder.name}" created successfully.`
    });
  };

  const startRenameFolder = (folder) => {
    if (!canEditFolder(folder)) {
      const alerts = JSON.parse(localStorage.getItem('alerts') || '[]');
      alerts.push({
        username: user.username,
        file: folder.name,
        action: 'unauthorized_folder_rename_attempt',
        targetUser: folder.createdBy,
        risk: 'high',
        date: new Date().toISOString()
      });
      localStorage.setItem('alerts', JSON.stringify(alerts));
      setResult({
        status: 'unauthorized_access',
        message: `⚠️ ALERT! Only the folder owner or admin can rename this folder. Admin has been notified!`
      });
      return;
    }
    setEditingFolderId(folder.id);
    setEditingFolderName(folder.name);
    setResult(null);
  };

  const saveFolderRename = () => {
    if (!editingFolderName.trim() || !editingFolderId) {
      setError('Please enter a valid folder name');
      return;
    }
    const savedFolders = JSON.parse(localStorage.getItem('folders') || '[]');
    const index = savedFolders.findIndex((folder) => folder.id === editingFolderId);
    if (index >= 0) {
      if (!canEditFolder(savedFolders[index])) {
        setError('You are not allowed to rename this folder');
        return;
      }
      savedFolders[index].name = editingFolderName.trim();
      localStorage.setItem('folders', JSON.stringify(savedFolders));
      loadFolders();
      setEditingFolderId(null);
      setEditingFolderName('');
      const alerts = JSON.parse(localStorage.getItem('alerts') || '[]');
      alerts.push({
        username: user.username,
        file: savedFolders[index].name,
        action: 'renamed',
        risk: 'normal',
        date: new Date().toISOString()
      });
      localStorage.setItem('alerts', JSON.stringify(alerts));
      setResult({
        status: 'success',
        message: `Folder renamed successfully.`
      });
    }
  };

  const cancelFolderRename = () => {
    setEditingFolderId(null);
    setEditingFolderName('');
  };

  const startMoveFile = (fileData) => {
    if (fileData.uploadedBy !== user.username) {
      const alerts = JSON.parse(localStorage.getItem('alerts') || '[]');
      alerts.push({
        username: user.username,
        file: fileData.filename,
        action: 'unauthorized_move_attempt',
        targetUser: fileData.uploadedBy,
        risk: 'high',
        date: new Date().toISOString()
      });
      localStorage.setItem('alerts', JSON.stringify(alerts));
      setResult({
        status: 'unauthorized_access',
        message: `⚠️ ALERT! You can only move files you uploaded. Admin has been notified!`
      });
      return;
    }
    setFileToMove(fileData);
    setMoveTargetFolderId(fileData.folderId || selectedFolderId || folders[0]?.id || '');
  };

  const saveMoveFile = () => {
    if (!fileToMove || !moveTargetFolderId) {
      setError('Please select a target folder');
      return;
    }
    const sharedFiles = JSON.parse(localStorage.getItem('sharedFiles') || '[]');
    const index = sharedFiles.findIndex((fileData) => fileData.id === fileToMove.id);
    if (index >= 0) {
      sharedFiles[index] = {
        ...sharedFiles[index],
        folderId: moveTargetFolderId
      };
      localStorage.setItem('sharedFiles', JSON.stringify(sharedFiles));
      loadSavedFiles();
      const alerts = JSON.parse(localStorage.getItem('alerts') || '[]');
      alerts.push({
        username: user.username,
        file: fileToMove.filename,
        action: 'moved',
        risk: 'normal',
        date: new Date().toISOString()
      });
      localStorage.setItem('alerts', JSON.stringify(alerts));
      setResult({
        status: 'success',
        message: `File "${fileToMove.filename}" moved successfully.`
      });
    }
    setFileToMove(null);
    setMoveTargetFolderId('');
  };

  const cancelMoveFile = () => {
    setFileToMove(null);
    setMoveTargetFolderId('');
  };

  const compressData = async (data) => {
    if (!window.CompressionStream) {
      return data;
    }
    const stream = new CompressionStream('gzip');
    const writer = stream.writable.getWriter();
    const reader = stream.readable.getReader();

    writer.write(new TextEncoder().encode(data));
    writer.close();

    const chunks = [];
    let done = false;
    while (!done) {
      const { value, done: readerDone } = await reader.read();
      if (value) chunks.push(value);
      done = readerDone;
    }

    return btoa(String.fromCharCode(...new Uint8Array(chunks.flat())));
  };

  const decompressData = async (compressedData) => {
    if (!window.DecompressionStream) {
      return compressedData;
    }
    const binaryString = atob(compressedData);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const stream = new DecompressionStream('gzip');
    const writer = stream.writable.getWriter();
    const reader = stream.readable.getReader();

    writer.write(bytes);
    writer.close();

    const chunks = [];
    let done = false;
    while (!done) {
      const { value, done: readerDone } = await reader.read();
      if (value) chunks.push(value);
      done = readerDone;
    }

    return new TextDecoder().decode(new Uint8Array(chunks.flat()));
  };

  // Simple MD5 implementation (not cryptographically secure, but for demo)
  const simpleMD5 = async (data) => {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data[i];
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    const hashStr = Math.abs(hash).toString(16).padStart(8, '0');
    return new Uint8Array(hashStr.match(/.{2}/g).map(byte => parseInt(byte, 16)));
  };

  const calculateHash = async (fileData, algorithm) => {
    let data;
    if (fileData instanceof ArrayBuffer) {
      data = fileData;
    } else {
      const encoder = new TextEncoder();
      data = encoder.encode(fileData);
    }

    let hashBuffer;
    if (algorithm === 'sha256') {
      hashBuffer = await crypto.subtle.digest('SHA-256', data);
    } else if (algorithm === 'md5') {
      hashBuffer = await simpleMD5(new Uint8Array(data));
    }

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setResult(null);
      setError('');
    }
  };

  const handleGenerateHash = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const fileContent = await file.arrayBuffer();
      const isText = file.type.startsWith('text/') || ['txt', 'js', 'json', 'html', 'css', 'md', 'py', 'java', 'c', 'cpp', 'xml', 'svg'].includes(fileName.split('.').pop().toLowerCase());
      let contentToStore;
      let compressed = false;

      if (isText) {
        const textContent = await file.text();
        contentToStore = await compressData(textContent);
        compressed = true;
      } else {
        contentToStore = btoa(String.fromCharCode(...new Uint8Array(fileContent)));
      }

      const hash = await calculateHash(fileContent, hashAlgorithm);
      setFileHash(hash);

      const sharedFiles = JSON.parse(localStorage.getItem('sharedFiles') || '[]');
      const fileData = {
        id: Date.now(),
        filename: fileName,
        content: contentToStore,
        compressed,
        isText,
        hash,
        algorithm: hashAlgorithm,
        size: file.size,
        type: file.type,
        folderId: selectedFolderId,
        uploadedBy: user.username,
        date: new Date().toISOString()
      };
      sharedFiles.push(fileData);
      localStorage.setItem('sharedFiles', JSON.stringify(sharedFiles));
      loadSavedFiles();

      const alerts = JSON.parse(localStorage.getItem('alerts') || '[]');
      alerts.push({
        username: user.username,
        file: fileName,
        action: 'uploaded',
        risk: 'normal',
        date: new Date().toISOString()
      });
      localStorage.setItem('alerts', JSON.stringify(alerts));

      setResult({
        status: 'success',
        message: `File "${fileName}" saved to folder and hash generated successfully using ${hashAlgorithm.toUpperCase()}`
      });
    } catch (err) {
      setError('Error generating hash: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDetectModification = async () => {
    if (!fileHash || !storedHash) {
      setError('Please generate current hash and enter stored hash');
      return;
    }

    // Compare hashes
    const isModified = fileHash !== storedHash;

    if (isModified) {
      // Create alert for modification - high risk
      const alerts = JSON.parse(localStorage.getItem('alerts') || '[]');
      alerts.push({
        username: user.username,
        file: fileName,
        action: 'modified',
        risk: 'high',
        date: new Date().toISOString()
      });
      localStorage.setItem('alerts', JSON.stringify(alerts));

      setResult({
        status: 'modified',
        message: `⚠️ ALERT! File "${fileName}" has been modified. Hash mismatch detected!`
      });
    } else {
      setResult({
        status: 'safe',
        message: `✅ File "${fileName}" is safe. Hash matches - no unauthorized modifications detected.`
      });
    }
  };

  const downloadFile = (fileData) => {
    // Check if user is the owner or has correct hash
    if (fileData.uploadedBy === user.username) {
      // Owner can download without hash verification
      performDownload(fileData);
    } else {
      // Ask for hash verification for other users
      const enteredHash = prompt(`This file was uploaded by ${fileData.uploadedBy}. Enter the correct ${fileData.algorithm.toUpperCase()} hash to download:`);
      if (enteredHash && enteredHash.trim() === fileData.hash) {
        performDownload(fileData);
        setResult({
          status: 'authorized_download',
          message: `File "${fileData.filename}" downloaded successfully with correct hash verification`
        });
      } else {
        // Create alert for unauthorized access attempt - high risk
        const alerts = JSON.parse(localStorage.getItem('alerts') || '[]');
        alerts.push({
          username: user.username,
          file: fileData.filename,
          action: 'unauthorized_download_attempt',
          targetUser: fileData.uploadedBy,
          risk: 'high',
          date: new Date().toISOString()
        });
        localStorage.setItem('alerts', JSON.stringify(alerts));

        setResult({
          status: 'unauthorized_access',
          message: `⚠️ ALERT! Unauthorized download attempt for "${fileData.filename}". Admin has been notified!`
        });
      }
    }
  };

  const performDownload = async (fileData) => {
    let content;
    if (fileData.isText) {
      content = fileData.compressed ? await decompressData(fileData.content) : fileData.content;
    } else {
      const binaryString = atob(fileData.content);
      content = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        content[i] = binaryString.charCodeAt(i);
      }
    }
    const blob = new Blob([content], { type: fileData.type || 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileData.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Create alert for admin - normal action
    const alerts = JSON.parse(localStorage.getItem('alerts') || '[]');
    alerts.push({
      username: user.username,
      file: fileData.filename,
      action: 'downloaded',
      risk: 'normal',
      date: new Date().toISOString()
    });
    localStorage.setItem('alerts', JSON.stringify(alerts));
  };

  const editFile = async (fileData) => {
    if (fileData.uploadedBy !== user.username) {
      // Create alert for unauthorized edit attempt - high risk
      const alerts = JSON.parse(localStorage.getItem('alerts') || '[]');
      alerts.push({
        username: user.username,
        file: fileData.filename,
        action: 'unauthorized_edit_attempt',
        targetUser: fileData.uploadedBy,
        risk: 'high',
        date: new Date().toISOString()
      });
      localStorage.setItem('alerts', JSON.stringify(alerts));

      setResult({
        status: 'unauthorized_access',
        message: `⚠️ ALERT! You can only edit files you uploaded. Admin has been notified!`
      });
      return;
    }

    setEditingFile(fileData);
    const content = fileData.isText ? (fileData.compressed ? await decompressData(fileData.content) : fileData.content) : '';
    setEditContent(content);
  };

  const saveEditedFile = async () => {
    if (!editingFile) return;

    try {
      // Calculate new hash for edited content
      const newHash = await calculateHash(editContent, editingFile.algorithm);

      // Update file in shared storage
      const sharedFiles = JSON.parse(localStorage.getItem('sharedFiles') || '[]');
      const fileIndex = sharedFiles.findIndex(f => f.id === editingFile.id);

      if (fileIndex >= 0) {
        // Compress content before saving
        const compressedContent = await compressData(editContent);

        sharedFiles[fileIndex] = {
          ...sharedFiles[fileIndex],
          content: compressedContent,
          compressed: true,
          hash: newHash,
          date: new Date().toISOString()
        };
        localStorage.setItem('sharedFiles', JSON.stringify(sharedFiles));

        // Create alert for modification - normal action
        const alerts = JSON.parse(localStorage.getItem('alerts') || '[]');
        alerts.push({
          username: user.username,
          file: editingFile.filename,
          action: 'edited',
          risk: 'normal',
          date: new Date().toISOString()
        });
        localStorage.setItem('alerts', JSON.stringify(alerts));

        loadSavedFiles();
        setEditingFile(null);
        setEditContent('');

        setResult({
          status: 'edited',
          message: `File "${editingFile.filename}" edited successfully. New hash: ${newHash.substring(0, 16)}...`
        });
      }
    } catch (err) {
      setError('Error saving edited file: ' + err.message);
    }
  };

  const deleteFile = (fileData) => {
    if (fileData.uploadedBy !== user.username) {
      // Create alert for unauthorized delete attempt - high risk
      const alerts = JSON.parse(localStorage.getItem('alerts') || '[]');
      alerts.push({
        username: user.username,
        file: fileData.filename,
        action: 'unauthorized_delete_attempt',
        targetUser: fileData.uploadedBy,
        risk: 'high',
        date: new Date().toISOString()
      });
      localStorage.setItem('alerts', JSON.stringify(alerts));

      setResult({
        status: 'unauthorized_access',
        message: `⚠️ ALERT! You can only delete files you uploaded. Admin has been notified!`
      });
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${fileData.filename}"?`)) {
      const sharedFiles = JSON.parse(localStorage.getItem('sharedFiles') || '[]');
      const filteredFiles = sharedFiles.filter(f => f.id !== fileData.id);
      localStorage.setItem('sharedFiles', JSON.stringify(filteredFiles));

      // Create alert for deletion - high risk action
      const alerts = JSON.parse(localStorage.getItem('alerts') || '[]');
      alerts.push({
        username: user.username,
        file: fileData.filename,
        action: 'deleted',
        risk: 'high',
        date: new Date().toISOString()
      });
      localStorage.setItem('alerts', JSON.stringify(alerts));

      loadSavedFiles();

      setResult({
        status: 'deleted',
        message: `File "${fileData.filename}" deleted successfully`
      });
    }
  };

  const verifyFileIntegrity = async (fileData) => {
    try {
      let content;
      if (fileData.isText) {
        content = fileData.compressed ? await decompressData(fileData.content) : fileData.content;
      } else {
        const binaryString = atob(fileData.content);
        content = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          content[i] = binaryString.charCodeAt(i);
        }
      }
      const currentHash = await calculateHash(content, fileData.algorithm);
      const isValid = currentHash === fileData.hash;

      if (!isValid) {
        // Create alert for integrity violation - high risk
        const alerts = JSON.parse(localStorage.getItem('alerts') || '[]');
        alerts.push({
          username: user.username,
          file: fileData.filename,
          action: 'integrity_violation',
          risk: 'high',
          date: new Date().toISOString()
        });
        localStorage.setItem('alerts', JSON.stringify(alerts));

        setResult({
          status: 'integrity_violation',
          message: `⚠️ ALERT! File "${fileData.filename}" integrity compromised!`
        });
      } else {
        setResult({
          status: 'integrity_ok',
          message: `✅ File "${fileData.filename}" integrity verified successfully`
        });
      }
    } catch (err) {
      setError('Error verifying file integrity: ' + err.message);
    }
  };

  const displayedFiles = savedFiles.filter((fileData) => fileData.folderId === selectedFolderId);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">File Scanner & Manager 🔍</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - File Operations */}
          <div>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Folder Management</h2>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Current Folder:</label>
                <select
                  value={selectedFolderId || ''}
                  onChange={(e) => setSelectedFolderId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {folders.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="New folder name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={createFolder}
                  className="w-full lg:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-5 rounded-lg transition-colors"
                >
                  + Create Folder
                </button>
              </div>

              <div className="space-y-3">
                {folders.map((folder) => (
                  <div key={folder.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50">
                    {editingFolderId === folder.id ? (
                      <div className="flex-1 flex flex-col gap-2">
                        <input
                          type="text"
                          value={editingFolderName}
                          onChange={(e) => setEditingFolderName(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={saveFolderRename}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelFolderRename}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <p className="font-semibold text-gray-900">{folder.name}</p>
                          <p className="text-xs text-gray-500">Created by {folder.createdBy}</p>
                        </div>
                        <button
                          onClick={() => startRenameFolder(folder)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm"
                        >
                          Rename
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Hash Generation Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Generate Hash</h2>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Select File to Upload</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-700"
                />
                {fileName && <p className="mt-2 text-sm text-gray-500">Selected: {fileName}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Hash Algorithm:</label>
                <div className="flex gap-4">
                  {['sha256', 'md5'].map((algo) => (
                    <label key={algo} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        value={algo}
                        checked={hashAlgorithm === algo}
                        onChange={(e) => setHashAlgorithm(e.target.value)}
                        className="mr-2"
                      />
                      <span className="font-semibold text-blue-600 uppercase">{algo}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerateHash}
                disabled={!file || loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-4"
              >
                {loading ? 'Processing...' : `Save to Folder & Generate ${hashAlgorithm.toUpperCase()} Hash`}
              </button>

              {fileHash && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">
                    {hashAlgorithm.toUpperCase()} Hash ({file?.size} bytes):
                  </p>
                  <p className="font-mono bg-white p-3 rounded border text-sm break-all">
                    {fileHash}
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(fileHash);
                      alert('Hash copied!');
                    }}
                    className="mt-3 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-sm"
                  >
                    📋 Copy Hash
                  </button>
                </div>
              )}
            </div>

            {/* Hash Comparison Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Verify File Integrity</h2>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Stored Hash (paste original hash):
                </label>
                <input
                  type="text"
                  value={storedHash}
                  onChange={(e) => setStoredHash(e.target.value)}
                  placeholder="Paste the original hash here"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                />
              </div>

              <button
                onClick={handleDetectModification}
                disabled={!fileHash || !storedHash}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Verify Integrity
              </button>
            </div>
          </div>

          {/* Right Column - File Folder */}
          <div>
            {/* File Folder Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">📁 Shared File Folder ({displayedFiles.length} files)</h2>

              {displayedFiles.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No files in this folder. Upload a file or select a different folder!</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {displayedFiles.map((fileData) => (
                    <div key={fileData.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{fileData.filename}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 bg-blue-100 px-2 py-1 rounded">
                            {fileData.algorithm.toUpperCase()}
                          </span>
                          {fileData.uploadedBy === user.username && (
                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                              Your file
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">
                        Size: {fileData.size} bytes | Uploaded by: <strong>{fileData.uploadedBy}</strong> | Date: {new Date(fileData.date).toLocaleDateString()}
                      </p>

                      <p className="text-xs text-gray-500 mb-3 font-mono">
                        Hash: {fileData.hash.substring(0, 20)}...
                      </p>

                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => downloadFile(fileData)}
                          className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm"
                        >
                          📥 Download
                        </button>
                        {fileData.isText && (
                          <button
                            onClick={() => editFile(fileData)}
                            disabled={fileData.uploadedBy !== user.username}
                            className={`py-1 px-3 rounded text-sm ${
                              fileData.uploadedBy === user.username
                                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            ✏️ Edit
                          </button>
                        )}
                          <button
                            onClick={() => startMoveFile(fileData)}
                            disabled={fileData.uploadedBy !== user.username}
                            className={`py-1 px-3 rounded text-sm ${
                              fileData.uploadedBy === user.username
                                ? 'bg-purple-500 hover:bg-purple-600 text-white'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            📦 Move
                          </button>
                        <button
                          onClick={() => deleteFile(fileData)}
                          disabled={fileData.uploadedBy !== user.username}
                          className={`py-1 px-3 rounded text-sm ${
                            fileData.uploadedBy === user.username
                              ? 'bg-red-500 hover:bg-red-600 text-white'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        {editingFile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold">Edit File: {editingFile.filename}</h3>
              </div>

              <div className="p-6">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full h-64 p-4 border border-gray-300 rounded-lg font-mono text-sm"
                  placeholder="Edit file content..."
                />
              </div>

              <div className="p-6 border-t flex justify-end gap-3">
                <button
                  onClick={() => {
                    setEditingFile(null);
                    setEditContent('');
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEditedFile}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {fileToMove && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-xl font-semibold">Move File: {fileToMove.filename}</h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Target Folder</label>
                  <select
                    value={moveTargetFolderId}
                    onChange={(e) => setMoveTargetFolderId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {folders.map((folder) => (
                      <option key={folder.id} value={folder.id}>
                        {folder.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={cancelMoveFile}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveMoveFile}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Move File
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Result Section */}
        {result && (
          <div className={`rounded-lg shadow p-6 border-l-4 mt-6 ${
            result.status === 'safe' || result.status === 'integrity_ok' || result.status === 'downloaded' || result.status === 'edited' || result.status === 'authorized_download'
              ? 'bg-green-50 border-green-500'
              : result.status === 'alert_created' || result.status === 'deleted'
              ? 'bg-yellow-50 border-yellow-500'
              : 'bg-red-50 border-red-500'
          }`}>
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-3">
                {result.status === 'safe' || result.status === 'integrity_ok' || result.status === 'downloaded' || result.status === 'edited' || result.status === 'authorized_download' ? '✅' :
                 result.status === 'alert_created' || result.status === 'deleted' ? '🔔' : '⚠️'}
              </span>
              <h3 className={`text-lg font-semibold ${
                result.status === 'safe' || result.status === 'integrity_ok' || result.status === 'downloaded' || result.status === 'edited' || result.status === 'authorized_download' ? 'text-green-700' :
                result.status === 'alert_created' || result.status === 'deleted' ? 'text-yellow-700' : 'text-red-700'
              }`}>
                {result.status === 'safe' ? 'File is Safe' :
                 result.status === 'integrity_ok' ? 'Integrity Verified' :
                 result.status === 'downloaded' ? 'File Downloaded' :
                 result.status === 'authorized_download' ? 'Authorized Download' :
                 result.status === 'edited' ? 'File Edited' :
                 result.status === 'deleted' ? 'File Deleted' :
                 result.status === 'alert_created' ? 'Alert Created' :
                 'Security Alert'}
              </h3>
            </div>
            <p className="text-gray-700">{result.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileScanner;
