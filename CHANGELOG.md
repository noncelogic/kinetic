# Changelog

## 1.0.0 (2026-02-08)


### Features

* add actual page screenshots ([982944a](https://github.com/noncelogic/kinetic/commit/982944a09ef571e53c74f7f573ad61107136c7f7))
* add quality gates discipline and helper scripts ([21755e1](https://github.com/noncelogic/kinetic/commit/21755e17f42135e758bab3d2e29c11714e9e9aea))
* **auth:** integrate Clerk ([4cad813](https://github.com/noncelogic/kinetic/commit/4cad813008ea0588dfd769a94c09c47b7d2aca71))
* **brand:** add Kinetic logo (Precision Block, Amber) ([90d9349](https://github.com/noncelogic/kinetic/commit/90d93493ab7e330f617e4656e8a2272795c70b92))
* capture application flow states for policy simulator ([96abe20](https://github.com/noncelogic/kinetic/commit/96abe20047a92361de0bf5b71b2536bd3a9600ac))
* Complete Concept Car Milestone ([c84296e](https://github.com/noncelogic/kinetic/commit/c84296e9ebc4316cc5a805658c5afeddc30812ca))
* complete concept-car milestone ([11cc1eb](https://github.com/noncelogic/kinetic/commit/11cc1ebf644c77e304a79196b6e753148fe89dc0))
* **kinetic:** add Phase 3 marketing landing page ([35b366e](https://github.com/noncelogic/kinetic/commit/35b366e8a449ddb0dfa99f9cdb29d56701d6bb7d))
* Scaffold Media Asset Bank (Concept Car) + Policy Simulator ([7614ac2](https://github.com/noncelogic/kinetic/commit/7614ac2b28300dafb1e340c1435d2d2b7fc3d17b))
* **service:** add generator settings support ([96e7c52](https://github.com/noncelogic/kinetic/commit/96e7c524e21a8d9c85e8c9a4550101e9003e81df))
* **service:** add vercel ai sdk ([17638ed](https://github.com/noncelogic/kinetic/commit/17638ed3b1d3c3f25208306a145bc3aa1d4392c5))
* **showroom:** add Kinetic Showroom marketing landing page ([efccdc5](https://github.com/noncelogic/kinetic/commit/efccdc51a6d41e896d4c17b6f2fca7f296ee6171))
* **showroom:** add Kinetic Showroom marketing landing page ([92754cb](https://github.com/noncelogic/kinetic/commit/92754cb2bb21d73abe29000a7164b4dc4f88077b))
* **upload:** integrate UploadThing ([ba85adf](https://github.com/noncelogic/kinetic/commit/ba85adf0c88e921eb98c02112a27ebaba50f871c))
* **web:** add UploadThing and Generator controls ([290aa9e](https://github.com/noncelogic/kinetic/commit/290aa9e9a937c2810c303e7495a708a2ea255ccd))
* **web:** add visual policy inspector ([4cca836](https://github.com/noncelogic/kinetic/commit/4cca83640b0d17f09912c157ca29362d76b9c74c))
* **web:** integrate v2 design system with Kinetic branding ([83c4959](https://github.com/noncelogic/kinetic/commit/83c49598d7c48bbc317021bd95f9c4522ca402d8))
* **web:** migrate Admin and Policy Simulator to v2 design system ([15fc26d](https://github.com/noncelogic/kinetic/commit/15fc26d5298458bcc846e58d0e64016d95500fd2))
* **web:** redesign dashboard with v2 design system ([68c5ec3](https://github.com/noncelogic/kinetic/commit/68c5ec3371f70fac90e346690724c4859126f627))
* **web:** update landing page for Concept Car ([a047e27](https://github.com/noncelogic/kinetic/commit/a047e27f690574e85079c5c8415ceb4359b1d305))
* **web:** wire up auth UI ([c768b94](https://github.com/noncelogic/kinetic/commit/c768b948f61359ae8b05e9e4419789913a0efc34))
* **web:** wire up feedback widget to DB ([68209c1](https://github.com/noncelogic/kinetic/commit/68209c11516dec96c08e59780802d02fbc646e36))


### Bug Fixes

* add format:check to preflight script ([71f686f](https://github.com/noncelogic/kinetic/commit/71f686f45c21b02d9a8a992fe1cdc01cba102f47))
* build errors, missing deps, and imports ([0ed6ef1](https://github.com/noncelogic/kinetic/commit/0ed6ef1ff8b5417ce53acfb007314cba0ef397db))
* **build:** add postinstall hook to generate prisma client ([a2e3c6b](https://github.com/noncelogic/kinetic/commit/a2e3c6b6f7fec472fb67b3ec800b1841a02ab832))
* Policy Simulator UUIDs and exclude e2e from typecheck/lint ([a3e632d](https://github.com/noncelogic/kinetic/commit/a3e632d956ea08667662d69e72a6754c994d5c63))
* **prisma:** add nextjs-monorepo-workaround-plugin for Vercel engine bundling ([#5](https://github.com/noncelogic/kinetic/issues/5)) ([2c0edd4](https://github.com/noncelogic/kinetic/commit/2c0edd4d901c2ab72b762ff63fb3b9510c42a32e))
* **prisma:** add rhel-openssl-3.0.x binary target for Vercel ([4feac0f](https://github.com/noncelogic/kinetic/commit/4feac0f236b01d251f6c48d70961cf0d935f6cb7))
* **prisma:** add rhel-openssl-3.0.x binary target for Vercel ([fa4aa9e](https://github.com/noncelogic/kinetic/commit/fa4aa9ea0e5729e6ca30eaa62c4aa9acb459b586))
* **prisma:** add serverExternalPackages to fix Vercel query engine bundling ([#4](https://github.com/noncelogic/kinetic/issues/4)) ([00be03a](https://github.com/noncelogic/kinetic/commit/00be03a2196afac34a8cf56be6912c6c207c357c))
* **prisma:** run prisma generate in web build script for Vercel ([a362745](https://github.com/noncelogic/kinetic/commit/a3627454494e58f5a6652946a02df8ff98ac5330))
* **prisma:** run prisma generate in web build script for Vercel ([e0130c2](https://github.com/noncelogic/kinetic/commit/e0130c2c7673cbeb18f1893f5baa5a370947de31))
* **service:** strict type check in asset router ([c19a15a](https://github.com/noncelogic/kinetic/commit/c19a15af7b72bf03b18fda6fef7e27266e36d35f))
* **user-nav:** apply dark mode styling to Sign In button ([9c45e32](https://github.com/noncelogic/kinetic/commit/9c45e32fe3ef775cf011afecb553ed3e730e455b))
* **vercel:** Lock build config for Turborepo monorepo ([7adbeda](https://github.com/noncelogic/kinetic/commit/7adbedaafcc8010e4f3862f53a377f506d815423))
* **vercel:** Use minimal vercel.json, rely on dashboard settings ([5cf1603](https://github.com/noncelogic/kinetic/commit/5cf16038a5456de98c158f0f27b5451d21ca3e96))
