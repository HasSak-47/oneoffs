import AceEditor from 'react-ace';

import ace from 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/theme-nord_dark';
import 'ace-builds/src-noconflict/keybinding-vim';

ace.config.set('basePath', '/oneoffs/assets');

export default AceEditor;
