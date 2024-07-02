import {
    getUsersService, getUserByIdService, createUserService, updateUserService,
    userExistsService, deleteUserService
} from "./users.service";
import {
    getEntitiesController, getEntityByIdController, createEntityController,
    updateEntityController, deleteEntityController
} from "../generics/generic.Controller";

// get all users
export const getUsersController = getEntitiesController(getUsersService);
// get user by id
export const getUserByIdController = getEntityByIdController(getUserByIdService);
// create user
export const createUserController = createEntityController(createUserService);
//  update user
export const updateUserController = updateEntityController(userExistsService, updateUserService);
// delete user
export const deleteUserController = deleteEntityController(userExistsService, deleteUserService);
