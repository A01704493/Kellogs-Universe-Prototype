# Kellogs Universe - Prototipo

Un mundo virtual interactivo inspirado en Club Penguin, desarrollado como prototipo para Kellogg's.

## Descripción

Kellogs Universe es una web app interactiva que permite a los usuarios (principalmente en iPads y celulares):

- Ingresar mediante una pantalla de "login" simulada (sin validación real)
- Navegar por un menú principal (tipo plaza con edificios) que representan distintas marcas de cereales
- Personalizar su avatar
- Entrar a edificios que contienen minijuegos específicos para cada marca
- Usar un módulo de "redeem" para canjear códigos promocionales

## Instrucciones de Instalación

### Requisitos Previos

- [Node.js](https://nodejs.org/) (v14 o superior)
- npm o yarn

### Pasos de Instalación

1. Clonar el repositorio:
   ```
   git clone https://github.com/tu-usuario/kellogs-universe-prototype.git
   cd kellogs-universe-prototype
   ```

2. Instalar dependencias:
   ```
   npm install
   # o si usas yarn
   yarn install
   ```

3. Iniciar el servidor de desarrollo:
   ```
   npm run dev
   # o si usas yarn
   yarn dev
   ```

4. La aplicación estará disponible en `http://localhost:5173`

## Características

- **Login Simulado**: Cualquier usuario/contraseña será aceptado
- **Plaza Interactiva**: Edificios para cada marca de cereales:
  - **Zucaritas**: Aventuras con Tony el Tigre
  - **Choco Krispis**: Aventuras con Melvin el elefante
  - **Froot Loops**: Diversión con Sam el tucán
- **Personalización de Avatar**: Personaliza cabeza, cuerpo y accesorios
- **Minijuegos**: Juegos específicos para cada marca de cereal
- **Sistema de Redención**: Códigos promocionales simulados

### Códigos para Pruebas

- `ZUCARITAS123` - Disfraz de tigre
- `CHOCOKRISPIS456` - Orejas de elefante
- `FROOTLOOPS789` - Pico de tucán
- `KELLOGS2023` - Capa de Superhéroe

## Tecnologías Utilizadas

- React con TypeScript
- Tailwind CSS para estilos
- Vite como bundler
- PWA para experiencia móvil mejorada

## Despliegue

El proyecto está configurado para ser desplegado en Vercel:

1. Conecta tu repositorio de GitHub a Vercel
2. Selecciona el repositorio en Vercel
3. Configure las opciones de build (automáticamente detectadas por Vercel)
4. Despliega

## Créditos

Desarrollado como prototipo para Kellogg's. 