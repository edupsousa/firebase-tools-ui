/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState, useEffect, useCallback } from 'react';
import * as firebase from 'firebase/app';
import 'firebase/database';
import { ThemeProvider } from '@rmwc/theme';
import { connect } from 'react-redux';
import { NodeContainer } from '../DataViewer/NodeContainer';
import { AppState } from '../../store';
import { DatabaseConfig } from '../../store/config';
import { initDatabase } from '../../firebase';

import './index.scss';
import '../DataViewer/index.scss';

export interface PropsFromState {
  namespace: string;
  config?: DatabaseConfig;
}

export type Props = PropsFromState;

const theme: Record<string, string> = {
  primary: '#039be5',
  primaryBg: '#039be5',
};

export const Database: React.FC<Props> = ({ config, namespace }) => {
  const [ref, setRef] = useState<firebase.database.Reference | undefined>(
    undefined
  );
  useEffect(() => {
    if (!config) return;
    const [db, { cleanup }] = initDatabase(config, namespace);
    setRef(db.ref());
    return cleanup;
  }, [config, namespace, setRef]);

  const doNavigate = useCallback(
    (path: string) => setRef(ref && ref.root.child(path)),
    [setRef, ref]
  );

  return (
    <div className="Database">
      <ThemeProvider options={theme}>
        {ref ? (
          <NodeContainer realtimeRef={ref} isViewRoot onNavigate={doNavigate} />
        ) : (
          <p>Loading</p>
        )}
      </ThemeProvider>
    </div>
  );
};

export const mapStateToProps = ({ config }: AppState) => ({
  config: config.config ? config.config.database : undefined,
});

export default connect(mapStateToProps)(Database);