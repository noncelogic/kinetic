import { createTRPCReact } from '@trpc/react-query';

import type { AppRouter } from '@repo/service';

export const trpc = createTRPCReact<AppRouter>();
