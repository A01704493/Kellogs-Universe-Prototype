# Calypso Universe - Prototipo

Un mundo virtual interactivo inspirado en Club Penguin, desarrollado como prototipo para Kellogg's.

## Descripción

Calypso Universe es una web app interactiva que permite a los usuarios (principalmente en iPads y celulares):

- Ingresar mediante una pantalla de "login" simulada (sin validación real)
- Navegar por un menú principal (tipo plaza con edificios) que representan distintas marcas/personajes
- Personalizar su avatar
- Entrar a edificios que contienen minijuegos simples
- Usar un módulo de "redeem" para canjear códigos promocionales

## Instrucciones de Instalación

### Requisitos Previos

- [Node.js](https://nodejs.org/) (v14 o superior)
- npm o yarn

### Pasos de Instalación

1. Clonar el repositorio:
   ```
   git clone https://github.com/tu-usuario/calypso-universe-prototype.git
   cd calypso-universe-prototype
   ```

2. Instalar dependencias:
   ```
   npm install
   # o si usas yarn
   yarn install
   ```

3. Iniciar el servidor de desarrollo:
   ```
   npm run start
   # o si usas yarn
   yarn start
   ```

4. La aplicación estará disponible en `http://localhost:5173`

## Características

- **Login Simulado**: Cualquier usuario/contraseña será aceptado
- **Plaza Interactiva**: Edificios para cada marca (ChocoCrisps, Sus Caritas, etc.)
- **Personalización de Avatar**: Personaliza cabeza, cuerpo y accesorios
- **Minijuegos**: Juegos simples dentro de los edificios
- **Sistema de Redención**: Códigos promocionales simulados

### Códigos para Pruebas

- `CHOCO123` - Sombrero de Chocolate
- `GATO456` - Orejas de Gato
- `CEREAL789` - 100 Monedas
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

Desarrollado como prototipo para Kellogg's por [Tu Nombre]. 