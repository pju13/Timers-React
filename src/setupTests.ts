// Ajoute les matchers DOM (toBeInTheDocument, toHaveTextContent, ...) à expect
import '@testing-library/jest-dom/vitest';

import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// `globals: true` n'est pas activé, donc Testing Library ne peut pas enregistrer
// son nettoyage automatique : on démonte les composants nous-mêmes après chaque test.
afterEach(() => {
    cleanup();
});
