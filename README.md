# EjercicioTelecentro
(Una prueba sin frameworks)
Los elementos son guardados en el localStorage, el back solo es responsable del guardado de imágenes.
El proyecto también se encuentra en linea.

# Archivos
```
  -EjercicioTelecentro
      -Back
            -Upload(contenedor de imagenes subidas)
            -Upload.php
      -Front
            -CSS
                -Style.css
            -JS
                -Script.js
      -Index.html
      -Pautas.jpg

```
# Instalación
No se utilizaron dependencias NPM.
Solo se necesita tener el proyecto en la carpeta htdocs, con Apache corriendo en el puerto 80.
La carpeta main debe llamarse tal cual (EjercicioTelecentro), debido a que la ruta del localhost nace en el htdocs.
```
  git init
```
```
  git pull https://github.com/AlejandroWilcke/EjercicioTelecentro
```
# Ejecución
```
  Abrir index.html
```

# Posible mejoras
Refactorización; una base de datos que guarde la información manualmente o al cerrar la página; encapsular los elementos en un contenedor con una scrollbar, para encapsularlos.
