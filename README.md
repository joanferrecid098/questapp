# Questapp

![MIT License](https://img.shields.io/github/license/joanferrecid098/questapp)
![GitHub Release (Latest)](https://img.shields.io/github/v/release/joanferrecid098/questapp)
![Frontend Image (Tag)](https://img.shields.io/docker/v/joanferrecid098/questapp-frontend/latest)
![Backend Image (Tag)](https://img.shields.io/docker/v/joanferrecid098/questapp-frontend/latest)

Questapp is a social and engaging web application that allows you to create and participate in daily surveys with friends, letting you share insights, start conversations, and discover preferences within your group. You can easily host it on your own server for private use or deploy it publicly for wider access.

<img src="https://github.com/user-attachments/assets/d439463f-f650-4e96-b822-225af1458d57" alt="Questapp Logo" width="150" height="150"/>

## Features

-   **Daily Group Surveys**: Every day, users get a set of new questions that they can answer to see how their responses align with their friends'.
-   **Question Customization**: Edit and personalize quiz questions to better suit your group's interests.
-   **Responsive Web Design**: Built for optimal experience on both desktop and mobile devices, making it accessible on-the-go.
-   **Docker Deployment Option**: Deploy effortlessly with Docker or follow local setup instructions to get Questapp running in your environment.

## FAQ

#### Does Questapp have a mobile version?

Currently, Questapp is only available as a responsive web application. Although there isn’t a native mobile app, the design is optimized for small screens, ensuring smooth use on mobile devices. A native app could be a future possibility if demand arises.

#### Can I customize the survey questions?

Absolutely! To modify the available questions, you can simply edit the `questions.json` file in the backend directory. This gives you complete control over the content, allowing you to add, modify, or remove questions to better match your group’s preferences.

#### Is Questapp available in multiple languages?

At the moment, Questapp supports only English. However, if there is enough interest, I plan to add support for other languages starting with Spanish, using _i18n internationalization_ to enable multilingual functionality.

## Deployment

Questapp can be easily deployed in a variety of environments. The recommended deployment method is through Docker, but you can also set it up locally for personal or development purposes.

### Docker Deployment

To deploy Questapp using Docker, you can use the following `docker-compose.yml` configuration to set up separate containers for the backend, frontend, and database components.

```yaml
services:
    backend:
        image: joanferrecid098/questapp-backend:latest
        container_name: questapp-backend
        ports:
            - "8080:8080"
        environment:
            PORT: 8080
            HOST: db
            USERNAME: questapp
            PASSWORD: Password!
            DB_PORT: 3306
            SECRET: VerySecure
            TZ: Z
        networks:
            - questapp-network

    frontend:
        image: joanferrecid098/questapp-frontend:latest
        container_name: questapp-frontend
        ports:
            # Change "80" to the port you want the UI on
            - "80:3000"
        environment:
            PUBLIC_BASE_URL: http://127.0.0.1:8080
        networks:
            - questapp-network

    db:
        image: joanferrecid098/questapp-db:latest
        container_name: questapp-db
        restart: always
        environment:
            MYSQL_DATABASE: "questapp"
            MYSQL_USER: "questapp"
            MYSQL_PASSWORD: "Password!"
            MYSQL_ROOT_PASSWORD: "Password!"
        ports:
            - "3306:3306"
        volumes:
            - ./data:/var/lib/mysql
        networks:
            - questapp-network

networks:
    questapp-network:
        driver: bridge
```

To build and deploy the images locally instead of using pre-built ones, clone the repository and run the following commands:

```bash
make build_db_image
make build_backend_image
make build_frontend_image
```

## Environment Variables

Configuring the environment variables correctly is essential for Questapp to run smoothly. These variables can be set in `.env` files in both the backend and frontend directories or directly in the Docker Compose file.

### Backend Variables

These are required to set up the backend server correctly:

-   `PORT`: The port number for the backend server (e.g., 8080).
-   `HOST`: The IP address for connecting to the database.
-   `DB_PORT`: The database port, typically set to 3306 for MySQL.
-   `USERNAME`: Username for accessing the database. If using the Questapp DB image, this must be set to `questapp`.
-   `PASSWORD`: Password for the database connection.
-   `SECRET`: A strong JWT secret key for securing sessions.

#### Example Backend `.env`

```
PORT=8080
HOST=127.0.0.1
DB_PORT=3306
USERNAME=questapp
PASSWORD=Password!
SECRET=VeryStrongPassword!
```

### Frontend Variables

These variables configure the frontend and help it connect to the backend.

-   `PUBLIC_BASE_URL`: The URL for accessing the backend API. Make sure users can access it, as it’s required for the application to function.

#### Example Frontend `.env`

```
PUBLIC_BASE_URL=http://127.0.0.1:8080
```

| Setting                                     | Description                       |
| ------------------------------------------- | --------------------------------- |
| `PUBLIC_BASE_URL=http://127.0.0.1:8080`     | For local usage                   |
| `PUBLIC_BASE_URL=http://192.168.1.150:8080` | For network-wide usage            |
| `PUBLIC_BASE_URL=http://<PUBLIC IP>:8080`   | For internet-wide usage (caution) |

> **Note:** Using a public IP is not recommended unless you are confident in your security setup.

## Run Locally

If you prefer to run Questapp locally without Docker, follow these steps to set up the application.

1. **Clone the project** from GitHub:

    ```bash
    git clone https://github.com/joanferrecid098/questapp.git
    ```

2. **Navigate to the project directory**:

    ```bash
    cd questapp
    ```

3. **Install dependencies** for both backend and frontend:

    ```bash
    cd backend && yarn
    cd ../frontend && yarn
    ```

4. **Set up environment variables** in the `.env` files for both frontend and backend, as explained above.

    ```bash
    cp .env.sample .env
    nano .env
    ```

5. **Build and start the frontend**:

    ```bash
    cd frontend
    yarn build
    ```

6. **Start the backend server**:

    ```bash
    cd ../backend
    yarn start
    ```

## Using Your Own MySQL Database

If you prefer to use an existing MySQL database instead of the provided Questapp database image, follow these steps:

1. **Create the Database**: Set up a new database called `questapp` in your MySQL instance.

2. **Initialize the Database**: Run the initialization script located in `./db/init.sql` to set up the required tables and data.

> **Note**: Ensure your database credentials match those specified in your environment variables for seamless connectivity.

## Contributing

Thank you for considering contributing to Questapp! Here are some guidelines to help you get started:

1. **Fork the Repository**: Begin by forking the Questapp repository on GitHub to make your changes in your own repository.

2. **Clone and Set Up**:

    - Clone the repository locally:
      `git clone https://github.com/joanferrecid098/questapp.git`
    - Follow the [Run Locally](#run-locally) section in this document to set up your environment, install dependencies, and define environment variables.

3. **Development Workflow**:

    - Make sure you’re using separate branches for each new feature or bug fix.
    - Ensure that all changes you make align with the project structure described in this document, such as keeping the backend and frontend organized in their respective directories.
    - If you’re adding features, follow the existing structure as much as possible. Any updates to deployment setups (Docker or local build) should be reflected in the `docker-compose.yml` or the [Deployment](#deployment) section.

4. **Testing**:

    - Test your changes thoroughly in both local and Docker environments to make sure they work seamlessly across setups.
    - Ensure that any modifications in configuration or environment variables are consistent with the formats outlined in the [Environment Variables](#environment-variables) section.

5. **Documentation**:

    - Update this README if your contribution requires additional setup instructions or environment variables.
    - Ensure any new features, commands, or variables are well-documented with clear explanations.

6. **Submit a Pull Request**:
    - Once your code is ready, submit a pull request to the main repository. Include a detailed description of the changes, and mention any relevant issues.
    - Make sure your code adheres to Questapp’s coding standards and `code of conduct`.

## Support

If you need help during your contribution, please reach out by opening an issue on GitHub. We appreciate all contributions, whether they are bug fixes, new features, or improvements to documentation!

## Images

<img src="https://github.com/user-attachments/assets/1a524455-10f6-42df-ae52-c775c964fe9f" alt="Desktop Demo" width="480" height="228.25"/>
<img src="https://github.com/user-attachments/assets/150c9937-8d1c-4f26-8d92-420755451cb1" alt="Desktop Demo" width="480" height="228.25"/>

<img src="https://github.com/user-attachments/assets/a16e35f5-2041-45f4-bcd8-aaf5e52a96cc" alt="Mobile Demo" width="187.5" height="406"/>
<img src="https://github.com/user-attachments/assets/2ab9748c-c235-4dfc-ac09-a9f4968e9b15" alt="Mobile Demo" width="187.5" height="406"/>

## Authors

-   [@joanferrecid098](https://www.github.com/joanferrecid098)
