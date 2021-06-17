import { Entity } from '@backstage/catalog-model';
import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  createRouteRef,
  discoveryApiRef,
} from '@backstage/core';

import { HarborApiClient, harborApiRef } from './api';
import { HARBOR_ANNOTATION_REPOSITORY } from './components/useHarborAppData';

export const isHarborAvailable = (entity: Entity) =>
  Boolean(entity?.metadata.annotations?.[HARBOR_ANNOTATION_REPOSITORY]);

export const entityContentRouteRef = createRouteRef({
  title: 'Harbor Entity Content',
});

export const harborPlugin = createPlugin({
  id: 'harbor',
  apis: [
    createApiFactory({
      api: harborApiRef,
      deps: { discoveryApi: discoveryApiRef },
      factory: ({ discoveryApi }) => new HarborApiClient({ discoveryApi }),
    }),
  ],
  routes: {
    entityContent: entityContentRouteRef,
  },
});

export const HarborPage = harborPlugin.provide(
  createRoutableExtension({
    component: () => import('./Router').then(m => m.Router),
    mountPoint: entityContentRouteRef,
  }),
);
