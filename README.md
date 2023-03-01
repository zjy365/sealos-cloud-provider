# Sealos Cloud Provider

https://www.sealos.io/docs/cloud/apps/scp/

## 目录说明

```
.
├── public
│   ├── favicon.ico
│   ├── iconfont
│   └── images
├── src
│   ├── components
│   │   ├── chakra_table
│   │   ├── delete_modal
│   │   ├── iconfont
│   │   ├── markdown
│   │   ├── scp_form
│   │   ├── scp_status
│   │   └── title_info
│   ├── interfaces
│   │   ├── api.ts
│   │   ├── infra_common.ts
│   │   └── session.ts
│   ├── layout
│   │   ├── index.module.scss
│   │   └── index.tsx
│   ├── pages
│   │   ├── _app.tsx
│   │   ├── _document.tsx
│   │   ├── add_page.module.scss
│   │   ├── add_page.tsx
│   │   ├── api
│   │   │   └── infra
│   │   │       ├── awsGet.ts
│   │   │       ├── awsGetAll.ts
│   │   │       ├── awsGetPrice.ts
│   │   │       ├── awsUpdate.ts
│   │   │       ├── aws_apply.ts
│   │   │       ├── aws_delete.ts
│   │   │       ├── getAllCluster.ts
│   │   │       ├── getCluster.ts
│   │   │       └── getConfigMap.ts
│   │   ├── detail.module.scss
│   │   ├── detail.tsx
│   │   ├── index.module.scss
│   │   └── index.tsx
│   ├── services
│   │   ├── kubernetes.ts
│   │   ├── request.ts
│   │   ├── response.ts
│   │   └── wrapper.ts
│   ├── stores
│   │   └── session.ts
│   ├── styles
│   │   ├── chakraTheme.ts
│   │   └── globals.scss
│   └── utils
│       ├── format.ts
│       └── strings.ts
├── tailwind.config.js
└── tsconfig.json
├── Dockerfile
├── README.md
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
```

## 项目依赖的库

```
{
  "name": "sealos-cloud-provider",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@chakra-ui/react": "^2.5.1", // Component library
    "@ctrl/golang-template": "^1.4.1",
    "@emotion/react": "^11.10.6",
    "@emotion/styled": "^11.10.6",
    "@kubernetes/client-node": "0.18.0",
    "@next/font": "13.1.1",
    "@tanstack/react-query": "^4.20.4",
    "axios": "1.2.1",
    "clsx": "^1.2.1",
    "dayjs": "^1.11.7",
    "eslint": "8.33.0",
    "eslint-config-next": "13.1.0",
    "fast-json-patch": "^3.1.1",
    "framer-motion": "^9.0.7",
    "github-markdown-css": "^5.1.0",
    "immer": "^9.0.16",
    "js-yaml": "^4.1.0",  // js and yaml conversions
    "lodash": "^4.17.21",
    "next": "13.1.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-hook-form": "^7.43.1", // Form processing
    "react-markdown": "^8.0.4",  // Markdown
    "react-syntax-highlighter": "^15.5.0",  // Code highlighting
    "sealos-desktop-sdk": "^0.1.6", // Communicate sdk with
    "ts-md5": "^1.3.1",
    "zustand": "^4.1.5"  // State management
  },
  "devDependencies": {
    "@types/js-yaml": "^4.0.5",
    "@types/lodash": "^4.14.191",
    "@types/node": "18.11.19",
    "@types/react": "18.0.27",
    "@types/react-dom": "18.0.10",
    "@types/react-syntax-highlighter": "^15.5.6",
    "autoprefixer": "^10.4.13",
    "postcss": "^8.4.21",
    "sass": "^1.57.1",
    "tailwindcss": "^3.2.4",
    "typescript": "4.9.5"
  }
}
```
