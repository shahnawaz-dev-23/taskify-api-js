exports.getUsers = (request, response) => {
    response.status(200).json({
        "status": true,
        "message": "Hello World!"
    });
}

exports.createUser = (request, response) => {
    response.status(201).json({
        "status": true,
        "message": "User created successfully"
    });
}