import {
    getVehiclesService, getVehicleByIdService, createVehicleService, updateVehicleService, deleteVehicleService, vehicleExistsService ,
    getVehiclesWithSpecsService, getVehicleWithSpecsByIdService
} from "./vehicle.service";
import {
    getEntitiesController, getEntityByIdController, createEntityController,
    updateEntityController, deleteEntityController
} from "../baseController/base.Generic.Controller";

// get all vehicles
export const getVehiclesController = getEntitiesController(getVehiclesService);
// get vehicle by id
export const getVehicleByIdController = getEntityByIdController(getVehicleByIdService);
// create vehicle
export const createVehicleController = createEntityController(createVehicleService);
//  update vehicle
export const updateVehicleController = updateEntityController(vehicleExistsService, updateVehicleService);
// delete vehicle
export const deleteVehicleController = deleteEntityController(vehicleExistsService, deleteVehicleService);
// get vehicles with specifications
export const getVehiclesWithSpecsController = getEntitiesController(getVehiclesWithSpecsService);
// get vehicles with specification by id
export const getVehicleWithSpecsByIdController = getEntityByIdController(getVehicleWithSpecsByIdService);