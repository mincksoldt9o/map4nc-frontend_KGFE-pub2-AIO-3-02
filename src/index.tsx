import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';

// tsconfig.json, webpack.config.js で エイリアスを切っているので、
// 今回のプロジェクトでの自分たちの依存先は '@my/......' ＝ 'src/.....' の関係で、フルパスで記載する
// このようなエイリアスがない場合相対パスで記載するため、場所によっては '../../../../path/to/Lib' のようにどこかわかり難い、間違えやすいものとなる。これを避けたい
// リビジョン更新の為のコメント追加
import Root from '@my/containers/systems/Root';

ReactDOM.render(<Root />, document.getElementById('root'));
