Monitora UFF
====
# About

Monitora UFF is a project that aims to create a camera monitoring system that uses several components that make up this system

The Map component is responsible to make it possible to create regions on the map, making it possible to add various college fields, in addition to being able to place cameras in these regions that can be viewed in the location where they were placed.

The Chat component is responsible for enabling communication between guards on monitoring duty, being able to generate tickets through chat commands.

The Ticket component is responsible for reporting issues on campus that need to be addressed. Priorities are assigned to these tickets so that they can be resolved based on their respective urgency.

The Inventory component is responsible for storing all data about UFF's inventory items, including information such as the last maintenance, location, and other specific details based on the object's type.

The cameras component is responsible for managing the cameras and accessing the streaming from it.

The mobile projcet has the objective of giving security to the students, by allowing them to use a SOS button to emergency times. It also makes the work of the security guards easier, by monitoring the cameras and adding devices in the map by their smartphone.

# Team

* Bruno Moraes Cotelo (joined in March 2023)
* Caio Márcio de Souza Santos da Silva (joined in September 2023)
* Heron Lancellot Peixoto de Lima (joined in July 2023)
* Leandro da Cruz Farias Matos (joined in July 2023)
* Rafael Aguiar Martins (joined in July 2023)
* Rafael Baptista Pillar Giordano (joined in July 2023)

# About the project folders

* The Back-End Folder, contains the server-side code, handling the application's business logic, database interactions, and overall server functionality.
* The Front-End Folder, contains all the client-side code responsible for user interaction and presentation.

### Folder Structure - [Guide](https://github.com/MonitoraUFF/MonitoraUFF/wiki/Structure-Guide)
    .
    ├── backend/
    │   ├── adapters/
    │   │   ├── glpi
    │   │   ├── uff
    │   │   └── zoneminder
    │   ├── core/
    │   │   ├── authentication
    │   │   ├── camera
    │   │   ├── chat
    │   │   ├── inventory
    │   │   ├── map
    │   │   └── ticket
    │   └── endpoints
    └── frontend/
        ├── mobile
        └── web

# Documentation

* [MonitoraUFF - Wiki Documentation](https://github.com/MonitoraUFF/MonitoraUFF/wiki)

# Development

* [Source Code](https://github.com/MonitoraUFF/MonitoraUFF/tree/main)
* [Issue Tracking](https://github.com/MonitoraUFF/MonitoraUFF/issues)

# Technologies

* [Python](https://www.python.org/doc/)
* [JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
* [TypeScript](https://www.typescriptlang.org/)
* [Material UI](https://mui.com/material-ui/)
* [GLPI](https://glpi-project.org/pt-br/)
* [Flask](https://flask.palletsprojects.com/en/3.0.x/)
* [OpenLayers](https://openlayers.org/)
* [OpenStreetMaps](https://www.openstreetmap.org/)
* [React](https://react.dev/)
* [Ionic](https://ionicframework.com/)
* [Capacitor](https://capacitorjs.com/)
* [ReactNative](https://reactnative.dev/)
* [ZoneMinder](https://zoneminder.com/)

# License
