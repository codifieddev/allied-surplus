# Project Detail: Ecommerce Vertical

## Project Overview

**Ecommerce Vertical** is a comprehensive e-commerce platform specializing in tactical gear and surplus equipment. The project is built as a modern, full-stack application leveraging **Next.js 15** for the frontend and **MongoDB** for data persistence. It features a robust **Admin Console** (Command Center) for managing products, logistics, communications, and personnel.

---

## Technical Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router architecture)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/), and [Shadcn UI](https://ui.shadcn.com/)
- **State Management**:
  - **Global State**: [Redux Toolkit](https://redux-toolkit.js.org/) (used for Auth, Products, Categories, Cart, etc.)
  - **Local/Small State**: [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- **Database**: [MongoDB](https://www.mongodb.com/) (Native driver)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **Authentication**: Custom JWT-based authentication with `bcryptjs` for password hashing and cookie-based session management.

---

## Project Structure

### Visual Architecture Tree

```text
ecommerce-vertical/
|-- app/
|   |-- [locale]/
|   |   |-- admin/
|   |   |   |-- branding/
|   |   |   |-- orders/
|   |   |   |-- products/
|   |   |   `-- theme/
|   |   |-- checkout/
|   |   |-- login/
|   |   `-- page.tsx
|   |-- api/
|   |   |-- auth/
|   |   |-- commerce/
|   |   `-- media/
|   |-- globals.css
|   `-- layout.tsx
|-- components/
|   |-- admin/
|   |   |-- forms/
|   |   |-- products/
|   |   `-- users/
|   |-- pages/
|   |   |-- CheckoutPage/
|   |   `-- HomePage/
|   |-- ui/
|   `-- app-sidebar.tsx
|-- lib/
|   |-- store/
|   |   |-- auth/
|   |   |-- products/
|   |   `-- store.ts
|   |-- mongodb.ts
|   `-- utils.ts
|-- models/
|   |-- Order.ts
|   |-- Product.ts
|   `-- User.ts
|-- public/
|   |-- assets/
|   `-- uploads/
|-- scripts/
|   |-- check_users.js
|   `-- seedEcommerceVertical.js
|-- next.config.ts
|-- package.json
`-- tsconfig.json
```

---

## Detailed Directory Breakdown

### `/app` (Routing & Layouts)

The routing system is built using Next.js 15's App Router, featuring a `[locale]` dynamic segment to support multi-language storefronts.

- **admin/**: Restricted area for store management (Orders, Inventory, Branding).
- **checkout/**: Secure customer transaction flow.
- **api/**: Serverless endpoints for authentication and commerce data.

### `/components` (UI System)

- **admin/**: Complex management modules (Product Studio, Form Matrix).
- **pages/**: Heavyweight components for specific routes.
- **ui/**: Atomic design elements based on Shadcn UI.
- **app-sidebar.tsx**: The core multi-tier navigation logic.

### `/lib` (Core Infrastructure)

- **store/**: Global state management using Redux Toolkit.
- **mongodb.ts**: Centralized database connection logic.
- **utils.ts**: Shared helper functions for styling and formatting.

### `/models` (Data Schemas)

- Type-safe definitions for Products, Orders, and Users used throughout the application.

---

## Admin Console Modules

The admin dashboard is organized into logical e-commerce sections:

1. **Sales & Analytics**: Dashboard analytics, Orders, Branding, and Theme customization.
2. **Catalog Management**: Management of Products, Categories, and Attributes.
3. **Content & Media**: Content management for Pages, Media assets, and the Sync Engine.
4. **User Management**: Customer (Personnel) and Admin (Command Staff) management.
5. **Forms & Submissions**: Form builder matrix and captured submission data.

---

## Key Features

- **Dynamic Theme Customizer**: Real-time updates to branding and colors via the Admin UI.
- **Tactical Product Studio**: A specialized interface for managing complex product variants and attributes.
- **Form Matrix**: A custom form builder for capturing field data.
- **Multi-tenant Architecture**: (Implied by the use of `tenant_slug` in signup flows).
- **Responsive Design**: Mobile-first approach with a "Military-Grade" aesthetic (Olive, Gold, Ink, and Charcoal color palette).

---

## Admin Sidebar Configuration (JSON)

Below is the structural representation of the Admin Sidebar as used in the `AppSidebar` component.

```json
{
  "sidebar_structure": [
    {
      "group": "Sales & Analytics",
      "items": [
        {
          "label": "Dashboard",
          "href": "/admin",
          "icon": "BarChart3",
          "exact": true,
          "badge": null
        },
        {
          "label": "Orders",
          "href": "/admin/orders",
          "icon": "ShoppingCart",
          "exact": false,
          "badge": null
        },
        {
          "label": "Branding",
          "href": "/admin/branding",
          "icon": "Sparkles",
          "exact": false,
          "badge": null
        },
        {
          "label": "Theme",
          "href": "/admin/theme",
          "icon": "Palette",
          "exact": false,
          "badge": null
        }
      ]
    },
    {
      "group": "Catalog Management",
      "items": [
        {
          "label": "Products",
          "href": "/admin/products",
          "icon": "Package",
          "exact": false,
          "badge": null
        },
        {
          "label": "Categories",
          "href": "/admin/categories",
          "icon": "Layers",
          "exact": false,
          "badge": null
        },
        {
          "label": "Attributes",
          "href": "/admin/attributes",
          "icon": "Tags",
          "exact": false,
          "badge": null
        }
      ]
    },
    {
      "group": "Content & Media",
      "items": [
        {
          "label": "Pages",
          "href": "/admin/pages",
          "icon": "FileText",
          "exact": false,
          "badge": null
        },
        {
          "label": "Media",
          "href": "/admin/media",
          "icon": "ImageIcon",
          "exact": false,
          "badge": null
        },
        {
          "label": "Engine",
          "href": "/admin/sync",
          "icon": "Cpu",
          "exact": false,
          "badge": "Live"
        }
      ]
    },
    {
      "group": "User Management",
      "items": [
        {
          "label": "Personnel",
          "href": "/admin/customers",
          "icon": "User",
          "exact": false,
          "badge": null
        },
        {
          "label": "Command Staff",
          "href": "/admin/users",
          "icon": "Shield",
          "exact": false,
          "badge": "Admin"
        }
      ]
    },
    {
      "group": "Forms & Submissions",
      "items": [
        {
          "label": "Form Matrix",
          "href": "/admin/forms",
          "icon": "Zap",
          "exact": false,
          "badge": null
        },
        {
          "label": "Captured Data",
          "href": "/admin/form-submissions",
          "icon": "Database",
          "exact": false,
          "badge": "New"
        }
      ]
    }
  ],
  "footer_actions": [
    {
      "label": "Account Settings",
      "href": "/admin/account-settings",
      "icon": "User",
      "details": "Command Admin (Primary)"
    },
    {
      "label": "Terminate Session",
      "action": "Logout",
      "icon": "LogOut"
    },
    {
      "label": "Quick Settings",
      "action": "Settings",
      "icon": "Settings"
    }
  ],
  "aesthetic_config": {
    "header": {
      "title": "Ecommerce Vertical",
      "subtitle": "Admin Console",
      "logo": "/assets/Image/footer-logo-2.webp",
      "theme_colors": {
        "background": "bg-olive",
        "border": "border-gold"
      }
    },
    "content_theme": "bg-ink",
    "active_item_style": "text-gold bg-olive/10 border-olive/30"
  }
}
```
