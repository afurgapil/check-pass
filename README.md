# Check Pass

This project is designed to provide users with a secure and efficient platform for storing sensitive data while ensuring its accuracy through a periodic verification process. With a focus on data privacy and security, this project offers a user-friendly experience for managing crucial information.

<div align="center">
 <a display="none" href="https://deviceframes.com/templates/"> <img src="https://github.com/afurgapil/check-pass/assets/99171546/68e5899f-c88d-4619-8170-f22cebaa5c91" alt="Live Preview"></a>
</div>
</div>

## Features

- Secure storage of sensitive data.
- Periodic verification process to validate the accuracy of stored data.
- Customizable notifications sent to designated email addresses in case of non-verification.
- User-friendly interface for easy interaction.
- Emphasis on maintaining data privacy and security.

## Requirements

- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) should be installed.
- [Expo CLI](https://docs.expo.dev/get-started/installation/) should be installed.
- Access to a [MongoDB](https://www.mongodb.com/) database.

For a detailed list of project dependencies and their versions, please refer to the `package.json` file.

## Installation

1. Clone this repository: `git clone https://github.com/afurgapil/check-pass.git`
2. Navigate to the project folder: `cd check-pass`
3. Install dependencies for App and Services.
4. Start the Expo development server: `npm start`

## Configuration

1. Create a `.env` file in the `services` directory.
2. Add the following line to your `.env`file and replace `YOUR_MONGODB_URI` with your actual MongoDB connection string:

   ```plaintext
   MONGODB_CONNECTION_STRING=mongodb+srv://username:password@your-cluster.mongodb.net/your-database-name
   ```

3. Check the `services/config.js` file and follow the necessary steps.

Default API_URL is set to http://localhost:3001 in config.js

## Usage

1. The Expo interface will open in your browser.
2. You can test the app using Android or iOS simulators.
3. If you want to test on a real device, you can use the Expo Client app.

## Contributions

Contributions are welcome! If you would like to contribute to the project, please create a new branch and send a pull request.

## License

This project is licensed under the MIT License. For more information, please refer to the `LICENSE` file.
