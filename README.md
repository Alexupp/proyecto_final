# Proyecto Final

Este proyecto es una aplicación web desarrollada con **React** que permite la gestión de usuarios, el registro y seguimiento de proyectos, generación de reportes, y manejo de autenticación con Firebase.

Realizada por : **Alexander Pérez Correa** y **Hendersson Iarley Machao Lopera**, Programación Web, Universidad de la Amazonia, Caquetá, Colombia.

## 📁 Estructura del Proyecto

```
Proyecto_Final/
│
├── public/                  # Archivos públicos
├── src/                     # Código fuente
│   ├── assets/              # Recursos estáticos (imágenes, íconos, etc.)
│   ├── Components/          # Componentes reutilizables
│   │   ├── footer/          # Pie de página
│   │   └── sidebar/         # Barra lateral de navegación
│   ├── Pages/               # Páginas principales de la aplicación
│   │   ├── detalle_proyecto/
│   │   ├── error_pagina/
│   │   ├── estado_proyecto/
│   │   ├── gestion_usuario/
│   │   ├── inicio/
│   │   ├── lista_proyecto/
│   │   ├── login/
│   │   ├── register/
│   │   ├── registro_avance/
│   │   ├── registro_proyecto/
│   │   └── reporte/
│   ├── App.jsx              # Componente raíz de la app
│   ├── main.jsx             # Punto de entrada
│   ├── firebase.js          # Configuración de Firebase
│   ├── App.css              # Estilos generales
│   └── index.css            # Estilos globales
│
├── cors.json                # Configuración de CORS si aplica
├── eslint.config.js         # Reglas de linting
├── index.html               # HTML principal
├── package.json             # Dependencias y scripts
├── vite.config.js           # Configuración de Vite
├── vercel.json              # Configuración para despliegue en Vercel
├── README.md                # Este archivo
└── .gitignore               # Archivos/Carpetas ignoradas por Git
```

## 🚀 Tecnologías Usadas

- **React** - Biblioteca de JavaScript para interfaces de usuario
- **Vite** - Empaquetador rápido para proyectos frontend
- **Firebase** - Autenticación y backend en la nube
- **Vercel** - Despliegue de la aplicación
- **CSS** - Estilización personalizada

## 🔥 Funcionalidades Principales

- Registro e inicio de sesión de usuarios
- Gestión de usuarios (crear, editar, eliminar)
- Registro y edición de proyectos
- Seguimiento de avances por proyecto
- Visualización de lista de proyectos y sus estados
- Generación de reportes
- Manejo de errores y navegación segura

## 🛠️ Instalación y Uso

1. Clonar el repositorio:

```bash
git clone https://github.com/tu-usuario/Proyecto_Final.git
cd Proyecto_Final
```

2. Instalar dependencias:

```bash
npm install
npm install react-router-dom
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install jspdf jspdf-autotable
npm install firebase
npm install dotenv
```

3. Configurar Firebase en `src/firebase.js`.

4. Iniciar servidor de desarrollo:

```bash
npm run dev
```

5. Accede desde tu navegador a `http://localhost:5173`.

## ✅ Despliegue

El proyecto puede desplegarse fácilmente en **Vercel** usando el archivo `vercel.json`.

https://proyecto-final-pied-phi.vercel.app/inicio