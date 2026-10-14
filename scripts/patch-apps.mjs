// Apply narrow, fail-closed modifications to the immutable original shell.
export const REPLACEMENTS = {
  "src/WinXP/apps/Notepad/index.js": [
    {
      "from": "import React, { useState } from 'react';",
      "to": "import React, { useState, useEffect } from 'react';\nimport { getDisk } from '../../../core/vfs/browserDisk.js';"
    },
    {
      "from": "export default function Notepad({ onClose }) {",
      "to": "export default function Notepad({ onClose, filePath }) {"
    },
    {
      "from": "  const [wordWrap, setWordWrap] = useState(false);\n",
      "to": "  const [wordWrap, setWordWrap] = useState(false);\n\n  const [savedPath, setSavedPath] = useState(null);\n  const [status, setStatus] = useState('');\n  useEffect(() => {\n    if (!filePath) return;\n    let active = true;\n    getDisk().then(disk => {\n      const text = disk.readFile(filePath);\n      if (text === null) throw Error('Document not found');\n      if (active) { setSavedPath(filePath); setDocText(text); setStatus(filePath); }\n    }).catch(error => { if (active) setStatus(error.message); });\n    return () => { active = false; };\n  }, [filePath]);\n\n  function askPath(suggestion) {\n    const name = window.prompt('File name (My Documents):', suggestion || 'Untitled.txt');\n    if (name === null) return null;\n    const candidate = name.trim();\n    if (!/^[^\\\\/:*?\"<>|]+\\.txt$/i.test(candidate) || candidate === '.' || candidate === '..') {\n      window.alert('Choose a valid .txt file name');\n      return null;\n    }\n    return 'C:/My Documents/' + candidate;\n  }\n\n  async function saveDocument(saveAs = false) {\n    const target = !saveAs && savedPath ? savedPath : askPath(savedPath?.split('/').pop());\n    if (!target) return;\n    try {\n      const disk = await getDisk();\n      const actual = await disk.writeFile(target, docText);\n      setSavedPath(actual);\n      setStatus('Saved: ' + actual);\n    } catch (error) { setStatus(error.message); window.alert(error.message); }\n  }\n\n  async function openDocument() {\n    const path = askPath(savedPath?.split('/').pop());\n    if (!path) return;\n    try {\n      const disk = await getDisk();\n      const text = disk.readFile(path);\n      if (text === null) throw Error('Document not found');\n      setSavedPath(path);\n      setDocText(text);\n      setStatus(path);\n    } catch (error) { setStatus(error.message); window.alert(error.message); }\n  }\n"
    },
    {
      "from": "      case 'Exit':\n",
      "to": "      case 'New':\n        if (!docText || window.confirm('Discard this document?')) {\n          setDocText(''); setSavedPath(null); setStatus('');\n        }\n        break;\n      case 'Open...':\n        openDocument();\n        break;\n      case 'Save':\n        saveDocument();\n        break;\n      case 'Save As...':\n        saveDocument(true);\n        break;\n      case 'Exit':\n"
    },
    {
      "from": "  function onTextAreaKeyDown(e) {\n",
      "to": "  function onTextAreaKeyDown(e) {\n    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {\n      e.preventDefault();\n      saveDocument();\n      return;\n    }\n"
    },
    {
      "from": "        spellCheck={false}\n      />\n",
      "to": "        spellCheck={false}\n      />\n      {status && <div role=\"status\" style={{ padding: '4px 8px', fontSize: 11, color: '#334b69' }}>{status}</div>}\n"
    }
  ],
  "src/WinXP/apps/Notepad/dropDownData.js": [
    {
      "from": "    disable: true,\n    text: 'New',",
      "to": "    text: 'New',"
    },
    {
      "from": "    disable: true,\n    text: 'Open...',",
      "to": "    text: 'Open...',"
    },
    {
      "from": "    disable: true,\n    text: 'Save',",
      "to": "    text: 'Save',"
    },
    {
      "from": "    disable: true,\n    text: 'Save As...',",
      "to": "    text: 'Save As...',"
    }
  ],
  "src/WinXP/apps/MyComputer/index.js": [
    {
      "from": "import React from 'react';",
      "to": "import React, { useEffect, useState } from 'react';\nimport { getDisk } from '../../../core/vfs/browserDisk.js';"
    },
    {
      "from": "function MyComputer({ onClose }) {",
      "to": "function MyComputer({ onClose, onOpenFile }) {\n  const [savedFiles, setSavedFiles] = useState([]);\n  const [diskStatus, setDiskStatus] = useState('');\n  useEffect(() => {\n    let active = true;\n    let unsubscribe = () => {};\n    getDisk().then(disk => {\n      if (!active) return;\n      const refresh = () => setSavedFiles(disk.listFiles());\n      refresh();\n      unsubscribe = disk.subscribe(refresh);\n    }).catch(error => { if (active) setDiskStatus(error.message); });\n    return () => { active = false; unsubscribe(); };\n  }, []);\n"
    },
    {
      "from": "          <div className=\"com__content__right\">\n",
      "to": "          <div className=\"com__content__right\">\n          <div className=\"com__content__right__card\" data-pfx-documents>\n            <div className=\"com__content__right__card__header\">My Documents</div>\n            <div className=\"com__content__right__card__content\" style={{ flexDirection: 'column', alignItems: 'stretch' }}>\n              {savedFiles.length === 0 && <div style={{ padding: '10px 12px', fontSize: 12 }}>{diskStatus || 'No saved documents'}</div>}\n              {savedFiles.map(file => (\n                <button key={file.path} type=\"button\" onDoubleClick={() => onOpenFile?.(file.path)}\n                  onClick={() => onOpenFile?.(file.path)}\n                  style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '7px 12px', border: 0, background: 'transparent', textAlign: 'left', cursor: 'pointer' }}>\n                  <img src={document} alt=\"\" width=\"24\" height=\"24\" />\n                  <span>{file.name}</span>\n                </button>\n              ))}\n            </div>\n          </div>\n"
    }
  ],
  "src/WinXP/Windows/index.js": [
    {
      "from": "  focusedAppId,\n}) {",
      "to": "  focusedAppId,\n  onOpenFile,\n}) {"
    },
    {
      "from": "          onMouseUpMaximize={onMaximize}\n",
      "to": "          onMouseUpMaximize={onMaximize}\n          onOpenFile={onOpenFile}\n"
    },
    {
      "from": "  onMouseUpMaximize,\n  header,",
      "to": "  onMouseUpMaximize,\n  onOpenFile,\n  header,"
    },
    {
      "from": "  component,\n  zIndex,",
      "to": "  component: Program,\n  zIndex,"
    },
    {
      "from": "        {component({\n          onClose: _onMouseUpClose,\n          onMinimize: _onMouseUpMinimize,\n          isFocus,\n          ...injectProps,\n        })}",
      "to": "        <Program\n          onClose={_onMouseUpClose}\n          onMinimize={_onMouseUpMinimize}\n          isFocus={isFocus}\n          onOpenFile={onOpenFile}\n          {...injectProps}\n        />"
    }
  ],
  "src/WinXP/index.js": [
    {
      "from": "  function onDoubleClickIcon(component) {",
      "to": "  const onOpenFile = useCallback(filePath => {\n    dispatch({ type: ADD_APP, payload: { ...appSettings.Notepad, injectProps: { filePath } } });\n  }, []);\n  function onDoubleClickIcon(component) {"
    },
    {
      "from": "      <Windows\n        apps={state.apps}",
      "to": "      <Windows\n        onOpenFile={onOpenFile}\n        apps={state.apps}"
    }
  ]
};
export function patchOriginalFile(path, source) {
  const rules = REPLACEMENTS[path];
  if (!rules) throw Error('No integration registered for: ' + path);
  let result = source;
  for (const { from, to } of rules) {
    const count = result.split(from).length - 1;
    if (count !== 1) throw Error(path + ': expected exactly one source anchor, found ' + count);
    result = result.replace(from, to);
  }
  return result;
}
