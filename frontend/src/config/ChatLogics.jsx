// this function do -> leave the user that logged in and return the user that is not logged in

export const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};