// PFx XP overlays are applied to a temporary upstream copy only.
export const PATCHES = Object.freeze({
  'src/context/vfsConstants.js': [
    {
      find: "export const EXE_PATHS = {\n",
      replace: "export const EXE_PATHS = {\n  PFX_TOOLS: 'C:/Program Files/PFx/Tools/pfx-tools.exe',\n",
    },
  ],
  'src/context/vfsDefaults.js': [
    {
      find: '  // ---- C:/Program Files — one real folder per installed program ----\n',
      replace:
        '  // ---- C:/Program Files — one real folder per installed program ----\n' +
        '  add(makeFolder(' + String.fromCharCode(96) + '${PROGRAM_FILES}/PFx' + String.fromCharCode(96) + ', { system: true }));\n' +
        '  add(makeFolder(' + String.fromCharCode(96) + '${PROGRAM_FILES}/PFx/Tools' + String.fromCharCode(96) + ', { system: true }));\n' +
        "  add(makeExe(EXE_PATHS.PFX_TOOLS, 65536, { iconKey: 'pfx-tools' }));\n",
    },
    {
      find: "  return [\n    ['Set Program Access and Defaults', EXE_PATHS.CONTROL, 'sm-access'],\n",
      replace:
        "  return [\n    ['PFx Tools', EXE_PATHS.PFX_TOOLS, 'pfx-tools'],\n" +
        "    ['Set Program Access and Defaults', EXE_PATHS.CONTROL, 'sm-access'],\n",
    },
  ],
  'src/context/vfsIcons.js': [
    {
      find: "import { getArt } from '../xpArt';\n",
      replace: "import { getArt } from '../xpArt';\nimport pfxToolsIcon from '../WinXP/apps/PFxTools/pfx-tools.svg';\n",
    },
    {
      find: 'export const ICON_REGISTRY = {\n',
      replace: "export const ICON_REGISTRY = {\n  'pfx-tools': { icon: pfxToolsIcon, iconLarge: pfxToolsIcon },\n",
    },
  ],
  'src/WinXP/apps/index.jsx': [
    {
      find: "import Notepad from './Notepad';\n",
      replace: "import Notepad from './Notepad';\nimport PFxTools from './PFxTools';\nimport pfxToolsIcon from './PFxTools/pfx-tools.svg';\n",
    },
    {
      find: 'export const PROGRAMS = {\n',
      replace:
        'export const PROGRAMS = {\n' +
        '  [EXE_PATHS.PFX_TOOLS]: {\n' +
        "    displayName: 'PFx Tools',\n" +
        "    description: 'Core system tools and applications',\n" +
        "    commandNames: ['pfx-tools', 'pfxtools'],\n" +
        "    header: { icon: pfxToolsIcon, title: 'PFx Tools' },\n" +
        '    component: PFxTools,\n' +
        '    defaultSize: { width: 590, height: 434 },\n' +
        '    minWidth: 480,\n' +
        '    minHeight: 370,\n' +
        '    resizable: true,\n' +
        '    multiInstance: false,\n' +
        '  },\n',
    },
  ],
});

export function applyRules(source, rules, name = 'source') {
  let patched = source;
  for (const { find, replace } of rules) {
    const occurrences = patched.split(find).length - 1;
    if (occurrences !== 1) {
      throw new Error(name + ': expected one patch anchor, found ' + occurrences + ': ' + find.trim().slice(0, 72));
    }
    patched = patched.replace(find, replace);
  }
  return patched;
}

export function patchSource(path, source) {
  const rules = PATCHES[path];
  if (!rules) throw new Error('No overlay registered for ' + path);
  return applyRules(source, rules, path);
}
